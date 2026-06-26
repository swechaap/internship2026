export type AmbulanceStatus = 'Available' | 'Busy' | 'Offline';
export type RequestStatus =
  | 'Requested'
  | 'Assigned'
  | 'On The Way'
  | 'Near Patient'
  | 'Patient Picked Up'
  | 'Heading To Hospital'
  | 'Reached Hospital'
  | 'Completed';
export type EmergencyPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AppSection = 'dashboard' | 'tracking' | 'requests' | 'ambulances';
export type EventTone = 'critical' | 'warning' | 'info' | 'success';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Ambulance extends Coordinates {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: AmbulanceStatus;
  workload: number;
  lastUpdated: string;
}

export interface AmbulanceFormInput {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: AmbulanceStatus;
}

export interface Hospital extends Coordinates {
  id: string;
  hospitalName: string;
}

export interface EmergencyRequestInput extends Coordinates {
  patientName: string;
  phone: string;
  address: string;
  emergencyType: string;
  priority: EmergencyPriority;
  source: 'manual' | 'sos';
}

export interface EmergencyRequest extends EmergencyRequestInput {
  id: string;
  requestTime: string;
  status: RequestStatus;
  ambulanceId: string | null;
  vehicleNumber: string | null;
  driverName: string | null;
  driverPhone: string | null;
  hospitalId: string | null;
  hospitalName: string | null;
 hospitalLatitude: number | null;
hospitalLongitude: number | null;
  estimatedDistanceKm: number;
  estimatedEtaMinutes: number;
  responseMinutes: number;
  allocationScore: number;
}

export interface TrackingSummary {
  currentArea: string;
  nextArea: string;
  destinationArea: string;
  currentSpeedKph: number;
  distanceRemainingKm: number;
  etaMinutes: number;
  currentLatitude: number;
  currentLongitude: number;
  lastUpdatedTime: string;
}

export interface TrackingPoint extends Coordinates {
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: EventTone;
}

export interface HospitalNotification {
  id: string;
  hospitalName: string;
  patientName: string;
  emergencyType: string;
  ambulanceNumber: string;
  etaMinutes: number;
  priority: EmergencyPriority;
  time: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardStats {
  totalAmbulances: number;
  availableAmbulances: number;
  busyAmbulances: number;
  activeEmergencies: number;
  completedTrips: number;
  averageResponseTime: number;
  averageArrivalTime: number;
}
