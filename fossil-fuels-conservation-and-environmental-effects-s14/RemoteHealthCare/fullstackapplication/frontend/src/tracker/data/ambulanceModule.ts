import type { Ambulance, EmergencyRequest, EmergencyRequestInput, Hospital, TrackingPoint } from '../types';

export const emergencyTypeOptions = [
  'Heart Attack',
  'Stroke',
  'Cardiac Arrest',
  'Major Accident',
  'Severe Bleeding',
  'Fracture',
  'Pregnancy Emergency',
  'General Illness',
] as const;

export const ambulanceFleet: Ambulance[] = [
  { id: 'AMB-101', vehicleNumber: 'TS-09-EM-101', driverName: 'Ravi Kumar', driverPhone: '+91 98765 11011', status: 'Available', workload: 1, latitude: 17.3855, longitude: 78.4860, lastUpdated: 'Now' },
  { id: 'AMB-102', vehicleNumber: 'TS-09-EM-205', driverName: 'Suresh Patel', driverPhone: '+91 98765 11022', status: 'Busy', workload: 2, latitude: 17.3901, longitude: 78.4850, lastUpdated: '2 min ago' },
  { id: 'AMB-103', vehicleNumber: 'TS-09-EM-334', driverName: 'Anita Sharma', driverPhone: '+91 98765 11033', status: 'Available', workload: 0, latitude: 17.4200, longitude: 78.5010, lastUpdated: 'Now' },
  { id: 'AMB-104', vehicleNumber: 'TS-09-EM-447', driverName: 'Mohan Das', driverPhone: '+91 98765 11044', status: 'Busy', workload: 3, latitude: 17.4500, longitude: 78.4930, lastUpdated: '5 min ago' },
  { id: 'AMB-105', vehicleNumber: 'TS-09-EM-501', driverName: 'Farah Khan', driverPhone: '+91 98765 11055', status: 'Available', workload: 1, latitude: 17.4320, longitude: 78.3825, lastUpdated: 'Now' },
];

export const hospitals: Hospital[] = [
  { id: 'HOS-1', hospitalName: 'Hyderabad Central Hospital', latitude: 17.3850, longitude: 78.4867 },
  { id: 'HOS-2', hospitalName: 'Secunderabad Emergency Center', latitude: 17.4399, longitude: 78.4983 },
  { id: 'HOS-3', hospitalName: 'Gachibowli Trauma Care', latitude: 17.4323, longitude: 78.3841 },
];

export const areaAnchors = [
  { name: 'Banjara Hills', latitude: 17.4195, longitude: 78.4347 },
  { name: 'Secunderabad', latitude: 17.4399, longitude: 78.4983 },
  { name: 'Hyderabad Central Hospital', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Hitech City', latitude: 17.4435, longitude: 78.3772 },
  { name: 'Necklace Road', latitude: 17.4195, longitude: 78.4707 },
];

export const liveRoute: TrackingPoint[] = [
  { latitude: 17.3855, longitude: 78.4860, timestamp: '2026-06-19T10:00:00.000Z' },
  { latitude: 17.3880, longitude: 78.4875, timestamp: '2026-06-19T10:00:03.000Z' },
  { latitude: 17.3902, longitude: 78.4890, timestamp: '2026-06-19T10:00:06.000Z' },
  { latitude: 17.3925, longitude: 78.4910, timestamp: '2026-06-19T10:00:09.000Z' },
  { latitude: 17.3950, longitude: 78.4932, timestamp: '2026-06-19T10:00:12.000Z' },
  { latitude: 17.3978, longitude: 78.4950, timestamp: '2026-06-19T10:00:15.000Z' },
  { latitude: 17.4005, longitude: 78.4968, timestamp: '2026-06-19T10:00:18.000Z' },
];

export const patientPoint = { latitude: 17.4195, longitude: 78.4347 };
export const hospitalPoint = { latitude: 17.3850, longitude: 78.4867 };

export const dashboardSnapshot = {
  totalAmbulances: ambulanceFleet.length,
  availableAmbulances: ambulanceFleet.filter((ambulance) => ambulance.status === 'Available').length,
  busyAmbulances: ambulanceFleet.filter((ambulance) => ambulance.status === 'Busy').length,
  activeEmergencies: 3,
  completedTrips: 42,
  averageResponseTime: 6.8,
  averageArrivalTime: 13.9,
};

export const emergencyRequestSeed: EmergencyRequest[] = [
  {
    id: 'REQ-9001',
    patientName: 'Anjali Rao',
    phone: '+91 99000 45001',
    address: 'Banjara Hills, Hyderabad',
    emergencyType: 'Cardiac Arrest',
    priority: 'CRITICAL',
    source: 'sos',
    latitude: 17.4195,
    longitude: 78.4347,
    requestTime: '2026-06-19T10:05:00.000Z',
    status: 'Assigned',
    ambulanceId: 'AMB-103',
    vehicleNumber: 'TS-09-EM-334',
    driverName: 'Anita Sharma',
    driverPhone: '+91 98765 11033',
    hospitalId: 'HOS-3',
    hospitalName: 'Gachibowli Trauma Care',
    estimatedDistanceKm: 5.2,
    estimatedEtaMinutes: 12,
    responseMinutes: 7,
    allocationScore: 3.2,
  },
  {
    id: 'REQ-9002',
    patientName: 'Rohit Shah',
    phone: '+91 99000 45002',
    address: 'Secunderabad, Hyderabad',
    emergencyType: 'Major Accident',
    priority: 'HIGH',
    source: 'manual',
    latitude: 17.4399,
    longitude: 78.4983,
    requestTime: '2026-06-19T09:45:00.000Z',
    status: 'On The Way',
    ambulanceId: 'AMB-101',
    vehicleNumber: 'TS-09-EM-101',
    driverName: 'Ravi Kumar',
    driverPhone: '+91 98765 11011',
    hospitalId: 'HOS-2',
    hospitalName: 'Secunderabad Emergency Center',
    estimatedDistanceKm: 3.0,
    estimatedEtaMinutes: 8,
    responseMinutes: 6,
    allocationScore: 2.9,
  },
  {
    id: 'REQ-9003',
    patientName: 'Lakshmi Devi',
    phone: '+91 99000 45003',
    address: 'Hitech City, Hyderabad',
    emergencyType: 'Stroke',
    priority: 'MEDIUM',
    source: 'manual',
    latitude: 17.4435,
    longitude: 78.3772,
    requestTime: '2026-06-19T09:20:00.000Z',
    status: 'Requested',
    ambulanceId: null,
    vehicleNumber: null,
    driverName: null,
    driverPhone: null,
    hospitalId: null,
    hospitalName: null,
    estimatedDistanceKm: 0,
    estimatedEtaMinutes: 0,
    responseMinutes: 0,
    allocationScore: 0,
  },
];

export const emergencyStatusOptions = [
  'Requested',
  'Assigned',
  'On The Way',
  'Near Patient',
  'Patient Picked Up',
  'Heading To Hospital',
  'Reached Hospital',
  'Completed',
] as const;

export const defaultRequestInput: EmergencyRequestInput = {
  patientName: 'Praveen Kumar',
  phone: '+91 98765 43210',
  address: 'Banjara Hills, Hyderabad',
  emergencyType: emergencyTypeOptions[0],
  priority: 'CRITICAL',
  source: 'sos',
  latitude: patientPoint.latitude,
  longitude: patientPoint.longitude,
};
