import type { Ambulance, ChartPoint, Hospital, HospitalNotification, EmergencyRequest, ActivityEvent } from '../types';

export const emergencyTypeOptions = [
  'Heart Attack',
  'Stroke',
  'Cardiac Arrest',
  'Major Accident',
  'Severe Bleeding',
  'Fracture',
  'Pregnancy Emergency',
  'General Illness',
];

export const ambulanceFleet: Ambulance[] = [
  {
    id: 'AMB-101',
    vehicleNumber: 'KA-05-ND-101',
    driverName: 'Ravi Kumar',
    driverPhone: '+91 98765 11011',
    status: 'Available',
    workload: 1,
    latitude: 12.9719,
    longitude: 77.5943,
    lastUpdated: 'Now',
  },
  {
    id: 'AMB-102',
    vehicleNumber: 'KA-05-ND-205',
    driverName: 'Suresh Patel',
    driverPhone: '+91 98765 11022',
    status: 'Busy',
    workload: 2,
    latitude: 12.9635,
    longitude: 77.5874,
    lastUpdated: '2 min ago',
  },
  {
    id: 'AMB-103',
    vehicleNumber: 'KA-05-ND-334',
    driverName: 'Anita Sharma',
    driverPhone: '+91 98765 11033',
    status: 'Available',
    workload: 0,
    latitude: 12.9842,
    longitude: 77.6051,
    lastUpdated: 'Now',
  },
  {
    id: 'AMB-104',
    vehicleNumber: 'KA-05-ND-447',
    driverName: 'Mohan Das',
    driverPhone: '+91 98765 11044',
    status: 'Busy',
    workload: 3,
    latitude: 12.9526,
    longitude: 77.5734,
    lastUpdated: '5 min ago',
  },
  {
    id: 'AMB-105',
    vehicleNumber: 'KA-05-ND-501',
    driverName: 'Farah Khan',
    driverPhone: '+91 98765 11055',
    status: 'Available',
    workload: 1,
    latitude: 12.9923,
    longitude: 77.5792,
    lastUpdated: 'Now',
  },
];

export const hospitals: Hospital[] = [
  {
    id: 'HOS-1',
    hospitalName: 'City General Hospital',
    latitude: 12.9766,
    longitude: 77.5993,
  },
  {
    id: 'HOS-2',
    hospitalName: 'Carewell Heart Center',
    latitude: 12.9608,
    longitude: 77.5829,
  },
  {
    id: 'HOS-3',
    hospitalName: 'Metro Emergency Clinic',
    latitude: 12.9876,
    longitude: 77.6211,
  },
];

export const analyticsTrips: ChartPoint[] = [
  { label: 'Mon', value: 19 },
  { label: 'Tue', value: 26 },
  { label: 'Wed', value: 22 },
  { label: 'Thu', value: 31 },
  { label: 'Fri', value: 28 },
  { label: 'Sat', value: 34 },
  { label: 'Sun', value: 24 },
];

export const responseTrend: ChartPoint[] = [
  { label: 'Week 1', value: 12 },
  { label: 'Week 2', value: 11 },
  { label: 'Week 3', value: 10 },
  { label: 'Week 4', value: 9 },
];

export const utilizationData: ChartPoint[] = [
  { label: 'Available', value: 48 },
  { label: 'Busy', value: 39 },
  { label: 'Offline', value: 13 },
];

export const emergencyBreakdown: ChartPoint[] = [
  { label: 'Critical', value: 18 },
  { label: 'High', value: 27 },
  { label: 'Medium', value: 35 },
  { label: 'Low', value: 20 },
];

export const seededRequests: EmergencyRequest[] = [
  {
    id: 'REQ-5001',
    patientName: 'Priya Nair',
    phone: '+91 98800 12001',
    address: 'MG Road, Bengaluru',
    emergencyType: 'Stroke',
    priority: 'CRITICAL',
    source: 'manual',
    latitude: 12.9752,
    longitude: 77.6058,
    requestTime: '2026-06-19T09:05:00.000Z',
    status: 'Completed',
    ambulanceId: 'AMB-103',
    vehicleNumber: 'KA-05-ND-334',
    driverName: 'Anita Sharma',
    driverPhone: '+91 98765 11033',
    hospitalId: 'HOS-1',
    hospitalName: 'City General Hospital',
    estimatedDistanceKm: 2.1,
    estimatedEtaMinutes: 8,
    responseMinutes: 6,
    allocationScore: 2.7,
  },
  {
    id: 'REQ-5002',
    patientName: 'Rohit Shah',
    phone: '+91 98800 12002',
    address: 'Indiranagar',
    emergencyType: 'Major Accident',
    priority: 'HIGH',
    source: 'manual',
    latitude: 12.9706,
    longitude: 77.6412,
    requestTime: '2026-06-19T09:35:00.000Z',
    status: 'Completed',
    ambulanceId: 'AMB-104',
    vehicleNumber: 'KA-05-ND-447',
    driverName: 'Mohan Das',
    driverPhone: '+91 98765 11044',
    hospitalId: 'HOS-3',
    hospitalName: 'Metro Emergency Clinic',
    estimatedDistanceKm: 4.4,
    estimatedEtaMinutes: 15,
    responseMinutes: 8,
    allocationScore: 5.1,
  },
];

export const seededEvents: ActivityEvent[] = [
  {
    id: 'EV-1',
    title: 'Fleet status synced',
    detail: 'All GPS devices reported within the last 5 seconds.',
    time: '1 min ago',
    tone: 'success',
  },
  {
    id: 'EV-2',
    title: 'Hospital readiness confirmed',
    detail: 'City General Hospital has 2 emergency bays available.',
    time: '3 min ago',
    tone: 'info',
  },
  {
    id: 'EV-3',
    title: 'Critical case completed',
    detail: 'Stroke patient delivered and handed over to doctors.',
    time: '9 min ago',
    tone: 'critical',
  },
];

export const seededHospitalNotifications: HospitalNotification[] = [
  {
    id: 'HN-1',
    hospitalName: 'City General Hospital',
    patientName: 'Priya Nair',
    emergencyType: 'Stroke',
    ambulanceNumber: 'KA-05-ND-334',
    etaMinutes: 8,
    priority: 'CRITICAL',
    time: '10 min ago',
  },
  {
    id: 'HN-2',
    hospitalName: 'Metro Emergency Clinic',
    patientName: 'Rohit Shah',
    emergencyType: 'Major Accident',
    ambulanceNumber: 'KA-05-ND-447',
    etaMinutes: 15,
    priority: 'HIGH',
    time: '21 min ago',
  },
];
