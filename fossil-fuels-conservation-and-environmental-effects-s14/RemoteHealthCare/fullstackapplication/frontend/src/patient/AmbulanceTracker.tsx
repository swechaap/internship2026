import 'leaflet/dist/leaflet.css';
import '../tracker/styles/global.css';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Ambulance, MapPinned, Menu, PhoneCall, Route, ShieldAlert, TimerReset, Users } from 'lucide-react';
import { Sidebar } from '../tracker/components/Sidebar';
import { StatCard } from '../tracker/components/StatCard';
import { TrackingMap } from '../tracker/components/TrackingMap';
import { areaAnchors, ambulanceFleet, dashboardSnapshot, defaultRequestInput, emergencyRequestSeed, emergencyTypeOptions, hospitals, hospitalPoint, patientPoint } from '../tracker/data/ambulanceModule';
import { estimateEtaMinutes, haversineKm, moveToward } from '../tracker/lib/allocation';
import { createEmergencyRequest, getDashboardStats, getNearestAmbulances, mapBackendCandidate, mapBackendRequest, updateAmbulanceLocation } from '../tracker/lib/backendApi';
import { forwardGeocode, reverseGeocode, shortLocationName } from '../tracker/lib/geocode';
import type { AppSection, Ambulance as AmbulanceType, Coordinates, EmergencyRequest, TrackingPoint } from '../tracker/types';

const responseSteps = ['Request Received', 'Ambulance Dispatched', 'En-Route', 'Patient Secured'] as const;

function formatCoordinate(value: number): string {
  return value.toFixed(4);
}

function findAreaName(latitude: number, longitude: number): string {
  const closest = [...areaAnchors]
    .map((anchor) => ({
      ...anchor,
      distance: haversineKm({ latitude, longitude }, { latitude: anchor.latitude, longitude: anchor.longitude }),
    }))
    .sort((left, right) => left.distance - right.distance)[0];

  return closest?.name ?? 'Government Hospital';
}

function buildNewRequestId() {
  return `REQ-${Date.now().toString().slice(-6)}`;
}

function resolveHospitalPoint(request: EmergencyRequest): Coordinates {
  if (
    request.hospitalLatitude &&
    request.hospitalLongitude &&
    request.hospitalLatitude !== 0 &&
    request.hospitalLongitude !== 0
  ) {
    return {
      latitude: request.hospitalLatitude,
      longitude: request.hospitalLongitude,
    };
  }

  return {
    latitude: request.latitude,
    longitude: request.longitude,
  };
}

function patientAreaLabel(address: string): string {
  const label = address.split(',')[0]?.trim();
  return label || 'Patient location';
}

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>(ambulanceFleet);
  const [requests, setRequests] = useState<EmergencyRequest[]>(emergencyRequestSeed);
  const [requestForm, setRequestForm] = useState(defaultRequestInput);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [requestNotice, setRequestNotice] = useState('');
  const [geocodeNotice, setGeocodeNotice] = useState('');
  const [activeAmbulanceId, setActiveAmbulanceId] = useState('AMB-103');
  const [trackingPath, setTrackingPath] = useState<TrackingPoint[]>([
    { latitude: 16.5062, longitude: 80.648, timestamp: '2026-06-19T10:00:00.000Z' },
    { latitude: 16.507, longitude: 80.6495, timestamp: '2026-06-19T10:00:03.000Z' },
    { latitude: 16.5082, longitude: 80.651, timestamp: '2026-06-19T10:00:06.000Z' },
    { latitude: 16.5095, longitude: 80.6525, timestamp: '2026-06-19T10:00:09.000Z' },
  ]);
  const [speedKph, setSpeedKph] = useState(38);
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [currentRouteStep, setCurrentRouteStep] = useState(2);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [dashboardStats, setDashboardStats] = useState(dashboardSnapshot);
  const [ambulanceLocationName, setAmbulanceLocationName] = useState('Banjara Hills');
  const [patientLocationName, setPatientLocationName] = useState('Banjara Hills');
  const [hospitalLocationName, setHospitalLocationName] = useState('Hyderabad Central Hospital');
  const [activeHospitalPoint, setActiveHospitalPoint] = useState<Coordinates>(hospitalPoint);
  const [nextAreaLabel, setNextAreaLabel] = useState('Banjara Hills');
  const [destinationAreaLabel, setDestinationAreaLabel] = useState('Hyderabad Central Hospital');

  const activeRequest = requests[0];
  const activeAmbulance = ambulances.find((ambulance) => ambulance.id === activeAmbulanceId) ?? ambulances[0];
  const activeRequestAmbulance = ambulances.find((ambulance) => ambulance.id === activeRequest.ambulanceId) ?? activeAmbulance;
  const recentRequests = requests.slice(0, 4);

  const livePoint = trackingPath.at(-1) ?? { latitude: activeAmbulance.latitude, longitude: activeAmbulance.longitude, timestamp: new Date().toISOString() };
  const currentArea = ambulanceLocationName;
  const nextArea = nextAreaLabel;
  const destinationArea = destinationAreaLabel;
  const distanceRemaining = haversineKm(livePoint, { latitude: activeRequest.latitude, longitude: activeRequest.longitude });

  const metrics = useMemo(
    () => [
      { label: 'Total Ambulances', value: String(dashboardStats.totalAmbulances), detail: 'Fleet currently registered', icon: <Ambulance size={20} />, tone: 'blue' as const },
      { label: 'Available Ambulances', value: String(ambulances.filter((ambulance) => ambulance.status === 'Available').length), detail: 'Ready for dispatch', icon: <Users size={20} />, tone: 'green' as const },
      { label: 'Busy Ambulances', value: String(ambulances.filter((ambulance) => ambulance.status === 'Busy').length), detail: 'On active calls', icon: <ShieldAlert size={20} />, tone: 'gray' as const },
      { label: 'Active Emergencies', value: String(dashboardStats.activeEmergencies), detail: 'Live critical cases', icon: <AlertTriangle size={20} />, tone: 'red' as const },
    ],
    [ambulances, dashboardStats.activeEmergencies, dashboardStats.totalAmbulances],
  );

  useEffect(() => {
    const address = requestForm.address.trim();
    if (address.length < 4) {
      setGeocodeNotice('');
      return;
    }

    setGeocodeNotice('Looking up GPS coordinates for this address...');

    const timer = window.setTimeout(() => {
      void forwardGeocode(address)
        .then((coords) => {
          setRequestForm((previous) =>
            previous.address.trim() === address
              ? { ...previous, latitude: coords.latitude, longitude: coords.longitude }
              : previous,
          );
          setGeocodeNotice('');
        })
        .catch((error) => {
          setGeocodeNotice(error instanceof Error ? error.message : 'Could not resolve this address. Is the backend running?');
        });
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [requestForm.address]);

  useEffect(() => {
    let cancelled = false;

    setPatientLocationName(activeRequest.address);
    setNextAreaLabel(patientAreaLabel(activeRequest.address));

    void reverseGeocode({ latitude: activeRequest.latitude, longitude: activeRequest.longitude })
      .then((name) => {
        if (!cancelled) {
          setNextAreaLabel(shortLocationName(name));
        }
      })
      .catch(() => undefined);

    const knownHospital = resolveHospitalPoint(activeRequest);
    setActiveHospitalPoint(knownHospital);
    setDestinationAreaLabel(activeRequest.hospitalName ?? 'Nearest hospital');

    if (activeRequest.hospitalId) {
      void reverseGeocode(knownHospital)
        .then((name) => {
          if (!cancelled) {
            setHospitalLocationName(shortLocationName(name));
          }
        })
        .catch(() => {
          if (!cancelled) {
            setHospitalLocationName(activeRequest.hospitalName ?? 'Nearest hospital');
          }
        });
    } else if (activeRequest.hospitalName) {
      void forwardGeocode(`${activeRequest.hospitalName}, India`)
        .then((coords) => {
          if (!cancelled) {
            setActiveHospitalPoint(coords);
          }
        })
        .catch(() => undefined);

      void reverseGeocode(knownHospital)
        .then((name) => {
          if (!cancelled) {
            setHospitalLocationName(shortLocationName(name));
          }
        })
        .catch(() => {
          if (!cancelled) {
            setHospitalLocationName(activeRequest.hospitalName ?? 'Nearest hospital');
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [activeRequest.address, activeRequest.hospitalId, activeRequest.hospitalName, activeRequest.id, activeRequest.latitude, activeRequest.longitude]);

  useEffect(() => {
    const assignedAmbulance = ambulances.find((ambulance) => ambulance.id === activeRequest.ambulanceId);
    const startPoint = assignedAmbulance ?? {
      latitude: activeRequest.latitude - 0.015,
      longitude: activeRequest.longitude - 0.015,
    };

    setTrackingPath([{ latitude: startPoint.latitude, longitude: startPoint.longitude, timestamp: new Date().toISOString() }]);
    setCurrentRouteStep(0);
  }, [activeRequest.id]);

  useEffect(() => {
    let cancelled = false;

    void reverseGeocode(livePoint)
      .then((name) => {
        if (!cancelled) {
          setAmbulanceLocationName(shortLocationName(name));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAmbulanceLocationName(findAreaName(livePoint.latitude, livePoint.longitude));
        }
      });

    void getDashboardStats()
      .then((stats) => {
        if (!cancelled) {
          setDashboardStats(stats);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDashboardStats(dashboardSnapshot);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [livePoint]);

  useEffect(() => {
    let cancelled = false;

    void getNearestAmbulances(activeRequest.latitude, activeRequest.longitude, activeRequest.priority)
      .then((candidates) => {
        if (cancelled || !candidates.length) {
          return;
        }

        const liveCandidate = mapBackendCandidate(candidates[0]);
        setActiveAmbulanceId(liveCandidate.id);
        setAmbulances((previous) =>
          previous.map((ambulance) =>
            ambulance.id === liveCandidate.id
              ? {
                  ...ambulance,
                  status: 'Busy',
                  workload: liveCandidate.workload,
                  latitude: liveCandidate.latitude,
                  longitude: liveCandidate.longitude,
                  lastUpdated: liveCandidate.lastUpdated,
                }
              : ambulance,
          ),
        );
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [activeRequest.id, activeRequest.latitude, activeRequest.longitude, activeRequest.priority]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTrackingPath((previous) => {
        const source = previous.at(-1) ?? activeAmbulance;
        const nextPoint = moveToward(source, { latitude: activeRequest.latitude, longitude: activeRequest.longitude }, 0.18);
        setSpeedKph((value) => Math.max(24, Math.min(54, value + (Math.random() * 4 - 2))));
        setEtaMinutes(Math.max(1, Math.round(estimateEtaMinutes(haversineKm(nextPoint, activeHospitalPoint)) * 0.8)));
        setCurrentRouteStep((step) => Math.min(responseSteps.length - 1, step < 2 ? step + 1 : step));
        setLastUpdated(new Date().toISOString());
        void updateAmbulanceLocation({
          ambulanceId: activeAmbulance.id,
          latitude: nextPoint.latitude,
          longitude: nextPoint.longitude,
          timestamp: Date.now(),
        });
        return [...previous.slice(-6), { ...nextPoint, timestamp: new Date().toISOString() }];
      });
    }, 3000);

    return () => window.clearInterval(timer);
  }, [activeAmbulance.id, activeAmbulance.latitude, activeAmbulance.longitude, activeHospitalPoint.latitude, activeHospitalPoint.longitude, activeRequest.latitude, activeRequest.longitude]);

  const toggleAmbulance = (ambulanceId: string) => {
    setActiveAmbulanceId(ambulanceId);
    setAmbulances((previous) =>
      previous.map((ambulance) =>
        ambulance.id === ambulanceId
          ? { ...ambulance, status: 'Busy', workload: ambulance.workload + 1, lastUpdated: 'Live' }
          : ambulance,
      ),
    );
  };

  const updateEta = () => {
    setEtaMinutes((value) => Math.max(1, value - 1));
    setLastUpdated(new Date().toISOString());
  };

  const updateRequestField = <K extends keyof typeof requestForm>(field: K, value: (typeof requestForm)[K]) => {
    setRequestForm((previous) => ({ ...previous, [field]: value }));
  };

  const useLiveLocation = async () => {
    if (!('geolocation' in navigator)) {
      setRequestStatus('error');
      setRequestNotice('Browser does not support geolocation.');
      return;
    }

    setRequestStatus('idle');
    setGeocodeNotice('');
    setRequestNotice('Requesting current location from your device...');

    const getCurrentPosition = (): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          },
        );
      });

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      setRequestNotice('Resolving current address from GPS coordinates...');
      const address = await reverseGeocode({ latitude, longitude });

      setRequestForm((previous) => ({
        ...previous,
        latitude,
        longitude,
        address,
      }));

      setRequestStatus('idle');
      setRequestNotice('Current location populated successfully.');
    } catch (error) {
      let message = 'Unable to access current location.';

      if (error && typeof error === 'object' && 'code' in error) {
        const positionError = error as GeolocationPositionError;
        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            message = 'Location permission denied.';
            break;
          case positionError.POSITION_UNAVAILABLE:
            message = 'GPS unavailable.';
            break;
          case positionError.TIMEOUT:
            message = 'Location timeout. Please try again.';
            break;
          default:
            message = positionError.message || message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      setRequestStatus('error');
      setRequestNotice(message);
    }
  };

  const submitEmergencyRequest = async () => {
    setRequestStatus('submitting');
    setRequestNotice('Resolving the address to GPS coordinates...');

    try {
      const gps = await forwardGeocode(requestForm.address.trim());
      setRequestForm((previous) => ({ ...previous, latitude: gps.latitude, longitude: gps.longitude }));
      setRequestNotice('Submitting emergency request to dispatch...');
      const response = await createEmergencyRequest({
        ...requestForm,
        latitude: gps.latitude,
        longitude: gps.longitude,
        source: requestForm.source,
      });

      const createdRequest = mapBackendRequest(response, {
        ...requestForm,
        latitude: gps.latitude,
        longitude: gps.longitude,
        source: requestForm.source,
      });

      setRequests((previous) => [
        {
          ...createdRequest,
          id: response.requestId ?? buildNewRequestId(),
          status: createdRequest.status,
        },
        ...previous,
      ]);

      if (response.ambulanceId) {
        setActiveAmbulanceId(response.ambulanceId);
      }

      const assignedAmbulance = ambulances.find((ambulance) => ambulance.id === response.ambulanceId);
      const routeStart = assignedAmbulance ?? {
        latitude: gps.latitude - 0.015,
        longitude: gps.longitude - 0.015,
      };

      setTrackingPath([{ latitude: routeStart.latitude, longitude: routeStart.longitude, timestamp: new Date().toISOString() }]);
      setCurrentRouteStep(0);
      setNextAreaLabel(patientAreaLabel(requestForm.address));
      setPatientLocationName(requestForm.address);
      setDestinationAreaLabel(response.hospitalName ?? 'Nearest hospital');

      setActiveSection('tracking');
      setRequestStatus('success');
      setRequestNotice(`Request created successfully for ${response.patientName}. The nearest ambulance is being assigned.`);
    } catch (error) {
      setRequestStatus('error');
      setRequestNotice(error instanceof Error ? error.message : 'Failed to create emergency request.');
    }
  };

  const renderRequestsSection = () => (
    <section className="page-shell">
      <header className="hero-panel">
        <div className="hero-panel__text">
          <p className="eyebrow">Patient Request</p>
          <h2 className="hero-title">Request an ambulance from the website</h2>
          <p className="hero-text">
            Fill in the patient details, choose the emergency type, and submit the request. The system sends it to the backend, finds the nearest ambulance, and starts the dispatch flow.
          </p>
          <div className="hero-meta">
            <span className="chip chip--critical"><AlertTriangle size={14} /> SOS request form</span>
            <span className="chip chip--info"><MapPinned size={14} /> GPS coordinates included</span>
            <span className="chip chip--success"><Route size={14} /> Auto dispatch after submit</span>
          </div>
        </div>
      </header>

      <section className="request-layout">
        <article className="panel form-shell">
          <div className="section-head">
            <div>
              <p className="eyebrow">Create Request</p>
              <h3 className="section-title">Emergency ambulance request</h3>
            </div>
            <button type="button" className="button button--ghost" onClick={useLiveLocation}>
              Use current patient location
            </button>
          </div>

          <div className="request-form">
            <label className="field">
              <span className="field__label">Patient Name</span>
              <input className="text-input" value={requestForm.patientName} onChange={(event) => updateRequestField('patientName', event.target.value)} />
            </label>

            <label className="field">
              <span className="field__label">Phone Number</span>
              <input className="text-input" value={requestForm.phone} onChange={(event) => updateRequestField('phone', event.target.value)} />
            </label>

            <label className="field request-form__full-width">
              <span className="field__label">Address</span>
              <textarea className="textarea" rows={3} value={requestForm.address} onChange={(event) => updateRequestField('address', event.target.value)} />
            </label>

            <label className="field">
              <span className="field__label">Emergency Type</span>
              <select className="select" value={requestForm.emergencyType} onChange={(event) => updateRequestField('emergencyType', event.target.value)}>
                {emergencyTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">Priority</span>
              <select className="select" value={requestForm.priority} onChange={(event) => updateRequestField('priority', event.target.value as typeof requestForm.priority)}>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </label>

            <label className="field">
              <span className="field__label">Latitude</span>
              <input className="text-input" type="number" step="0.0001" value={requestForm.latitude} onChange={(event) => updateRequestField('latitude', Number(event.target.value))} />
            </label>

            <label className="field">
              <span className="field__label">Longitude</span>
              <input className="text-input" type="number" step="0.0001" value={requestForm.longitude} onChange={(event) => updateRequestField('longitude', Number(event.target.value))} />
            </label>

            {geocodeNotice ? (
              <p className="request-form__message request-form__message--idle request-form__full-width">{geocodeNotice}</p>
            ) : null}

            <label className="field">
              <span className="field__label">Request Source</span>
              <select className="select" value={requestForm.source} onChange={(event) => updateRequestField('source', event.target.value as typeof requestForm.source)}>
                <option value="sos">SOS</option>
                <option value="manual">Manual</option>
              </select>
            </label>

            <div className="request-form__actions request-form__full-width">
              <button type="button" className="button button--critical" onClick={submitEmergencyRequest} disabled={requestStatus === 'submitting'}>
                <PhoneCall size={16} /> {requestStatus === 'submitting' ? 'Sending Request...' : 'Request Ambulance'}
              </button>
              <p className={`request-form__message request-form__message--${requestStatus}`}>{requestNotice || 'The backend will assign the nearest available ambulance.'}</p>
            </div>
          </div>
        </article>

        <aside className="panel request-summary">
          <div className="section-head">
            <div>
              <p className="eyebrow">Request Preview</p>
              <h3 className="section-title">What dispatch receives</h3>
            </div>
            <span className="chip chip--info">Backend ready</span>
          </div>

          <div className="emergency-card">
            <div className="field">
              <span className="field__label">Patient</span>
              <strong>{requestForm.patientName}</strong>
            </div>
            <div className="field">
              <span className="field__label">Address</span>
              <strong>{requestForm.address}</strong>
            </div>
            <div className="field">
              <span className="field__label">Emergency Type</span>
              <strong>{requestForm.emergencyType}</strong>
            </div>
            <div className="field">
              <span className="field__label">Priority</span>
              <strong>{requestForm.priority}</strong>
            </div>
            <div className="field">
              <span className="field__label">GPS Coordinates</span>
              <strong>{formatCoordinate(requestForm.latitude)}, {formatCoordinate(requestForm.longitude)}</strong>
            </div>
            <div className="field">
              <span className="field__label">Request Source</span>
              <strong>{requestForm.source.toUpperCase()}</strong>
            </div>
            <div className="field request-form__full-width">
              <span className="field__label">Assigned Ambulance</span>
              <strong>
                {activeRequestAmbulance.vehicleNumber} - {activeRequestAmbulance.driverName} ({activeRequestAmbulance.driverPhone})
              </strong>
            </div>
          </div>

          <div className="mini-panel">
            <h4 className="card-title">Recent requests</h4>
            <div className="recent-list">
              {recentRequests.map((request) => (
                <div key={request.id} className="recent-list__item">
                  <strong>{request.patientName}</strong>
                  <span>{request.address}</span>
                  <span>{request.status}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </section>
  );

  const renderDashboardSection = () => (
    <section className="page-shell">
      <header className="hero-panel">
        <div className="hero-panel__text">
          <p className="eyebrow">Ambulance Tracking</p>
          <h2 className="hero-title">Emergency UI for live response, patient routing, and ambulance monitoring</h2>
          <p className="hero-text">
            The layout keeps blue and green as the base visual language, while red is used only for critical emergency highlights and live status. The module is optimized for rapid scanning during high-stress situations.
          </p>
          <div className="hero-meta">
            <span className="chip chip--critical"><AlertTriangle size={14} /> Live Tracking Active</span>
            <span className="chip chip--info"><MapPinned size={14} /> {currentArea}</span>
            <span className="chip chip--success"><Route size={14} /> Response route synced</span>
          </div>
        </div>

        <div className="hero-actions">
          <button type="button" className="button button--ghost" onClick={() => setActiveSection('requests')}>
            Request Ambulance
          </button>
          <button type="button" className="button button--critical" onClick={updateEta}>
            <TimerReset size={16} /> Update ETA
          </button>
          <button type="button" className="button button--ghost" onClick={() => toggleAmbulance('AMB-103')}>
            Activate Ambulance
          </button>
        </div>
      </header>

      <section className="dashboard-grid" aria-label="Ambulance dashboard metrics">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="tracking-layout">
        <TrackingMap
          route={trackingPath}
          ambulancePoint={{ latitude: livePoint.latitude, longitude: livePoint.longitude }}
          patientPoint={{ latitude: activeRequest.latitude, longitude: activeRequest.longitude }}
          hospitalPoint={activeHospitalPoint}
          currentArea={currentArea}
          nextArea={nextArea}
          destinationArea={destinationArea}
          speedKph={speedKph}
          etaMinutes={etaMinutes}
          distanceRemainingKm={distanceRemaining}
          ambulanceLocationName={ambulanceLocationName}
          patientLocationName={patientLocationName}
          hospitalLocationName={hospitalLocationName}
        />

        <aside className="panel emergency-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Active Emergency Highlights</p>
              <h3 className="section-title">Critical distress panel</h3>
            </div>
            <span className="pulse-indicator">Live Tracking Active</span>
          </div>

          <div className="emergency-card">
            <div className="field">
              <span className="field__label">Remote Patient Name</span>
              <strong>{activeRequest.patientName}</strong>
            </div>
            <div className="field">
              <span className="field__label">Patient Location</span>
              <strong>{activeRequest.address}</strong>
            </div>
            <div className="field">
              <span className="field__label">Lat/Long GPS Coordinates</span>
              <strong>{formatCoordinate(activeRequest.latitude)}, {formatCoordinate(activeRequest.longitude)}</strong>
            </div>
            <div className="field">
              <span className="field__label">Emergency Type</span>
              <strong>{activeRequest.emergencyType}</strong>
            </div>
            <div className="field">
              <span className="field__label">Current Area</span>
              <strong>{currentArea}</strong>
            </div>
            <div className="field">
              <span className="field__label">Destination</span>
              <strong>{destinationArea}</strong>
            </div>
            <div className="field request-form__full-width">
              <span className="field__label">Assigned Ambulance</span>
              <strong>
                {activeRequest.vehicleNumber ?? activeRequestAmbulance.vehicleNumber} - {activeRequest.driverName ?? activeRequestAmbulance.driverName} ({activeRequest.driverPhone ?? activeRequestAmbulance.driverPhone})
              </strong>
            </div>

            <button type="button" className="button button--primary emergency-panel__button">
              <PhoneCall size={16} /> Contact Paramedic
            </button>
          </div>
        </aside>
      </section>

      <section className="bottom-grid">
        <article className="panel log-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Dispatch & Status Log</p>
              <h3 className="section-title">Emergency response timeline</h3>
            </div>
            <span className="chip chip--success">Last updated {new Date(lastUpdated).toLocaleTimeString()}</span>
          </div>

          <div className="timeline" role="list" aria-label="Response progress tracker">
            {responseSteps.map((step, index) => {
              const isActive = index === currentRouteStep;
              const isComplete = index < currentRouteStep;

              return (
                <div key={step} className={`timeline__step ${isActive ? 'timeline__step--active' : ''} ${isComplete ? 'timeline__step--complete' : ''}`} role="listitem">
                  <span className="timeline__dot">{index + 1}</span>
                  <div>
                    <strong>
                      {step}
                      {isActive ? ' (Active)' : ''}
                    </strong>
                    <p>
                      {index === 0 && 'Request received and validated by the emergency desk.'}
                      {index === 1 && 'Nearest ambulance dispatched with driver and vehicle assigned.'}
                      {index === 2 && 'En-Route status is active and the vehicle is being tracked live.'}
                      {index === 3 && 'Patient secured and ready for transfer to the destination hospital.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel fleet-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Ambulance Management</p>
              <h3 className="section-title">Search, edit, and control units</h3>
            </div>
            <span className="chip chip--info">Fleet actions are local-state driven</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Driver Name</th>
                  <th>Driver Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ambulances.map((ambulance) => (
                  <tr key={ambulance.id}>
                    <td>{ambulance.vehicleNumber}</td>
                    <td>{ambulance.driverName}</td>
                    <td>{ambulance.driverPhone}</td>
                    <td>
                      <span className={`status-badge status-badge--${ambulance.status.toLowerCase()}`}>{ambulance.status}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="table-action" onClick={() => toggleAmbulance(ambulance.id)}>
                          Toggle
                        </button>
                        <button type="button" className="table-action">Edit</button>
                        <button type="button" className="table-action">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );

  return (
    <div className="app-shell">
      <div className="app-shell__layout">
        <Sidebar activeSection={activeSection} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={setActiveSection} />

        <main className="app-shell__content">
          <div className="mobile-toolbar">
            <button type="button" className="icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={18} />
            </button>
          </div>

          <section className="page-shell">
            {activeSection === 'requests' ? renderRequestsSection() : renderDashboardSection()}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
export { App as AmbulanceTracker };


