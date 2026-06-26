import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import type { TrackingPoint } from '../types';
import './TrackingMap.css';

type TrackingMapProps = {
  route: TrackingPoint[];
  ambulancePoint: { latitude: number; longitude: number };
  patientPoint: { latitude: number; longitude: number };
  hospitalPoint: { latitude: number; longitude: number };
  currentArea: string;
  nextArea: string;
  destinationArea: string;
  speedKph: number;
  etaMinutes: number;
  distanceRemainingKm: number;
  ambulanceLocationName: string;
  patientLocationName: string;
  hospitalLocationName: string;
};

function FocusMap({
  ambulancePoint,
  patientPoint,
  hospitalPoint,
}: {
  ambulancePoint: { latitude: number; longitude: number };
  patientPoint: { latitude: number; longitude: number };
  hospitalPoint: { latitude: number; longitude: number };
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      [ambulancePoint.latitude, ambulancePoint.longitude],
      [patientPoint.latitude, patientPoint.longitude],
      [hospitalPoint.latitude, hospitalPoint.longitude],
    ]);
    map.fitBounds(bounds.pad(0.2), { animate: true, maxZoom: 14 });
  }, [ambulancePoint.latitude, ambulancePoint.longitude, hospitalPoint.latitude, hospitalPoint.longitude, map, patientPoint.latitude, patientPoint.longitude]);

  return null;
}

function buildMarkerIcon(label: string, tone: 'ambulance' | 'patient' | 'hospital') {
  const symbol = {
    ambulance: 'A',
    patient: 'P',
    hospital: 'H',
  }[tone];

  return L.divIcon({
    className: 'tracking-map__marker-shell',
    html: `<div class="tracking-map__marker tracking-map__marker--${tone}"><span class="tracking-map__marker-badge">${symbol}</span><span>${label}</span></div>`,
    iconSize: tone === 'ambulance' ? [168, 48] : [144, 40],
    iconAnchor: tone === 'ambulance' ? [84, 42] : [72, 20],
    popupAnchor: [0, -20],
  });
}

export function TrackingMap({
  route,
  ambulancePoint,
  patientPoint,
  hospitalPoint,
  currentArea,
  nextArea,
  destinationArea,
  speedKph,
  etaMinutes,
  distanceRemainingKm,
  ambulanceLocationName,
  patientLocationName,
  hospitalLocationName,
}: TrackingMapProps) {
  console.log("Patient:", patientPoint);
console.log("Hospital:", hospitalPoint);
console.log("Ambulance:", ambulancePoint);
  const routeLine = useMemo(() => route.map((point) => [point.latitude, point.longitude] as [number, number]), [route]);


  return (
    <section className="tracking-map">
      <div className="section-head">
        <div>
          <p className="eyebrow">Map-Based Tracking Area</p>
          <h3 className="section-title">Live GPS route with real location names</h3>
        </div>
        <div className="tracking-map__labels">
          <span className="chip chip--info">Current: {currentArea}</span>
          <span className="chip chip--success">Next: {nextArea}</span>
          <span className="chip chip--critical">Destination: {destinationArea}</span>
        </div>
      </div>

      <div className="tracking-map__frame">
        <MapContainer center={[ambulancePoint.latitude, ambulancePoint.longitude]} zoom={14} scrollWheelZoom className="tracking-map__canvas">
          <FocusMap ambulancePoint={ambulancePoint} patientPoint={patientPoint} hospitalPoint={hospitalPoint} />
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Polyline positions={routeLine} pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.9 }} />
          <Polyline positions={[[patientPoint.latitude, patientPoint.longitude], [hospitalPoint.latitude, hospitalPoint.longitude]]} pathOptions={{ color: '#16a34a', weight: 4, dashArray: '8 10', opacity: 0.85 }} />

          <Marker position={[ambulancePoint.latitude, ambulancePoint.longitude]} icon={buildMarkerIcon('AMBULANCE', 'ambulance')}>
            <Popup>Assigned Ambulance Route - {ambulanceLocationName}</Popup>
          </Marker>
          <Marker position={[patientPoint.latitude, patientPoint.longitude]} icon={buildMarkerIcon('PATIENT', 'patient')}>
            <Popup>Remote Patient Location - {patientLocationName}</Popup>
          </Marker>
          <Marker position={[hospitalPoint.latitude, hospitalPoint.longitude]} icon={buildMarkerIcon('HOSPITAL', 'hospital')}>
            <Popup>Destination Hospital - {hospitalLocationName}</Popup>
          </Marker>
        </MapContainer>

        <div className="tracking-map__legend" aria-label="Map legend">
          <span className="tracking-map__legend-item tracking-map__legend-item--ambulance">Ambulance live unit</span>
          <span className="tracking-map__legend-item tracking-map__legend-item--patient">Patient pickup point</span>
          <span className="tracking-map__legend-item tracking-map__legend-item--hospital">Hospital destination</span>
        </div>

        <div className="tracking-map__overlay">
          <p className="tracking-map__overlay-eyebrow">Assigned Ambulance Route</p>
          <h4>{ambulanceLocationName} to {destinationArea}</h4>
          <p className="tracking-map__live-name">Ambulance Location: {ambulanceLocationName}</p>
          <div className="tracking-map__overlay-grid">
            <div>
              <span>Current Speed</span>
              <strong>{Math.round(speedKph)} km/h</strong>
            </div>
            <div>
              <span>ETA</span>
              <strong>{etaMinutes} Minutes</strong>
            </div>
            <div>
              <span>Distance Remaining</span>
              <strong>{distanceRemainingKm.toFixed(1)} km</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}