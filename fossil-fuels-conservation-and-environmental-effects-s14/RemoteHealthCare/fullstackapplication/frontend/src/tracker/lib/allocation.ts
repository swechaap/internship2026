import type { Ambulance, Coordinates, EmergencyPriority, Hospital } from '../types';

export function haversineKm(start: Coordinates, end: Coordinates): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(end.latitude - start.latitude);
  const longitudeDelta = toRadians(end.longitude - start.longitude);
  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2) * Math.cos(startLatitude) * Math.cos(endLatitude);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimateEtaMinutes(distanceKm: number, trafficMultiplier = 1): number {
  const averageSpeedKmH = 32;
  const travelMinutes = (distanceKm / averageSpeedKmH) * 60 * trafficMultiplier;
  return Math.max(4, Math.round(travelMinutes));
}

export function calculateAllocationScore(
  ambulance: Ambulance,
  patient: Coordinates,
  priority: EmergencyPriority,
): { distanceKm: number; etaMinutes: number; score: number } {
  const distanceKm = haversineKm(ambulance, patient);
  const trafficMultiplier = trafficFactor(priority, ambulance.workload);
  const etaMinutes = estimateEtaMinutes(distanceKm, trafficMultiplier);
  const priorityPenalty = priorityOffset(priority);
  const score = distanceKm * 0.5 + etaMinutes * 0.4 + ambulance.workload * 0.1 - priorityPenalty;

  return {
    distanceKm: Number(distanceKm.toFixed(2)),
    etaMinutes,
    score: Number(score.toFixed(2)),
  };
}

export function pickBestAmbulance(
  ambulances: Ambulance[],
  patient: Coordinates,
  priority: EmergencyPriority,
): Array<Ambulance & { distanceKm: number; etaMinutes: number; score: number }> {
  return ambulances
    .filter((ambulance) => ambulance.status === 'Available')
    .map((ambulance) => ({ ...ambulance, ...calculateAllocationScore(ambulance, patient, priority) }))
    .sort((left, right) => left.score - right.score);
}

export function findNearestHospital(hospitals: Hospital[], patient: Coordinates): Hospital | null {
  if (!hospitals.length) {
    return null;
  }

  return hospitals
    .map((hospital) => ({ hospital, distanceKm: haversineKm(hospital, patient) }))
    .sort((left, right) => left.distanceKm - right.distanceKm)[0].hospital;
}

export function moveToward(source: Coordinates, target: Coordinates, factor = 0.18): Coordinates {
  return {
    latitude: source.latitude + (target.latitude - source.latitude) * factor,
    longitude: source.longitude + (target.longitude - source.longitude) * factor,
  };
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function trafficFactor(priority: EmergencyPriority, workload: number): number {
  const base = 1 + workload * 0.08;
  const priorityAdjustment = priority === 'CRITICAL' ? 0.92 : priority === 'HIGH' ? 0.98 : priority === 'MEDIUM' ? 1.04 : 1.08;
  return base * priorityAdjustment;
}

function priorityOffset(priority: EmergencyPriority): number {
  if (priority === 'CRITICAL') {
    return 1.2;
  }

  if (priority === 'HIGH') {
    return 0.6;
  }

  if (priority === 'MEDIUM') {
    return 0.3;
  }

  return 0;
}
