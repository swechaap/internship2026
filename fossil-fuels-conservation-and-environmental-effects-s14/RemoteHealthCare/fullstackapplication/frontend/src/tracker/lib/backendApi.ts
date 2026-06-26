import type { DashboardStats, EmergencyPriority, EmergencyRequest, EmergencyRequestInput, RequestStatus, TrackingPoint } from '../types';

const API_BASE_URL = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string, VITE_API_BASE_URL?: string } }).env?.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:1999';

type BackendRequestStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'ON_THE_WAY'
  | 'NEAR_PATIENT'
  | 'PATIENT_PICKED_UP'
  | 'HEADING_TO_HOSPITAL'
  | 'REACHED_HOSPITAL'
  | 'COMPLETED';

export interface BackendNearestAmbulanceCandidate {
  ambulanceId: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  latitude: number;
  longitude: number;
  workload: number;
  distanceKm: number;
  etaMinutes: number;
  score: number;
}

export interface BackendEmergencyRequestResponse {
  requestId: string;
  patientName: string;
  address: string;
  emergencyType: string;
  priority: EmergencyPriority;
  status: BackendRequestStatus;
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
  requestTime: string;
  candidates: BackendNearestAmbulanceCandidate[];
}

interface BackendEmergencyRequestRecord {
  requestId: string;
  patientName: string;
  phone: string;
  address: string;
  emergencyType: string;
  priority: EmergencyPriority;
  latitude: number;
  longitude: number;
  requestTime: string;
  status: BackendRequestStatus;
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

interface BackendLocationHistoryEntry {
  id: number;
  ambulanceId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface BackendTrackResponse {
  request: BackendEmergencyRequestRecord;
  locationHistory: BackendLocationHistoryEntry[];
}

export interface BackendDashboardStatsResponse extends DashboardStats {}

export interface AmbulanceLocationUpdateRequest {
  ambulanceId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface BackendRequestInput extends EmergencyRequestInput {
  latitude: number;
  longitude: number;
  source: 'manual' | 'sos';
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch {
    throw new Error('Cannot reach the backend API. Start the backend with: cd backend && mvn spring-boot:run');
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function toFrontendRequestStatus(status: BackendRequestStatus): RequestStatus {
  const map: Record<BackendRequestStatus, RequestStatus> = {
    REQUESTED: 'Requested',
    ASSIGNED: 'Assigned',
    ON_THE_WAY: 'On The Way',
    NEAR_PATIENT: 'Near Patient',
    PATIENT_PICKED_UP: 'Patient Picked Up',
    HEADING_TO_HOSPITAL: 'Heading To Hospital',
    REACHED_HOSPITAL: 'Reached Hospital',
    COMPLETED: 'Completed',
  };

  return map[status];
}

export function mapBackendCandidate(candidate: BackendNearestAmbulanceCandidate) {
  return {
    id: candidate.ambulanceId,
    vehicleNumber: candidate.vehicleNumber,
    driverName: candidate.driverName,
    driverPhone: candidate.driverPhone,
    status: 'Available' as const,
    workload: candidate.workload,
    latitude: candidate.latitude,
    longitude: candidate.longitude,
    lastUpdated: 'Live',
    distanceKm: candidate.distanceKm,
    etaMinutes: candidate.etaMinutes,
    score: candidate.score,
  };
}

export function mapBackendRequest(
  request: BackendEmergencyRequestResponse | BackendEmergencyRequestRecord,
  fallback: BackendRequestInput,
): EmergencyRequest {
  return {
    id: request.requestId,
    patientName: request.patientName,
    phone: fallback.phone,
    address: request.address,
    emergencyType: request.emergencyType,
    priority: request.priority,
    source: fallback.source,
    latitude: fallback.latitude,
    longitude: fallback.longitude,
    requestTime: request.requestTime,
    status: toFrontendRequestStatus(request.status),
    ambulanceId: request.ambulanceId,
    vehicleNumber: request.vehicleNumber,
    driverName: request.driverName,
    driverPhone: request.driverPhone,
    hospitalId: request.hospitalId,
    hospitalName: request.hospitalName,
    hospitalLatitude: request.hospitalLatitude,
    hospitalLongitude: request.hospitalLongitude,
    estimatedDistanceKm: request.estimatedDistanceKm,
    estimatedEtaMinutes: request.estimatedEtaMinutes,
    responseMinutes: request.responseMinutes,
    allocationScore: request.allocationScore,
  };
}

export function mapTrackHistory(history: BackendLocationHistoryEntry[]): TrackingPoint[] {
  return history.map((entry) => ({
    latitude: entry.latitude,
    longitude: entry.longitude,
    timestamp: entry.timestamp,
  }));
}

export async function createEmergencyRequest(payload: BackendRequestInput): Promise<BackendEmergencyRequestResponse> {
  return fetchJson<BackendEmergencyRequestResponse>('/api/emergency/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getNearestAmbulances(latitude: number, longitude: number, priority: EmergencyPriority) {
  return fetchJson<BackendNearestAmbulanceCandidate[]>(
    `/api/ambulance/nearest?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&priority=${encodeURIComponent(priority)}`,
  );
}

export async function getTrackRequest(requestId: string): Promise<BackendTrackResponse> {
  return fetchJson<BackendTrackResponse>(`/api/emergency/${encodeURIComponent(requestId)}`);
}

export async function getDashboardStats(): Promise<BackendDashboardStatsResponse> {
  return fetchJson<BackendDashboardStatsResponse>('/api/dashboard/stats');
}

export async function updateAmbulanceLocation(payload: AmbulanceLocationUpdateRequest): Promise<Record<string, unknown>> {
  return fetchJson<Record<string, unknown>>('/api/ambulance/location', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
