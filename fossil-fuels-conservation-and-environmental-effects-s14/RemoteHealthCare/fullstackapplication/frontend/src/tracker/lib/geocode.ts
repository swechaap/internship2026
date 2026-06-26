import type { Coordinates } from '../types';

interface GeocodeApiResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

export function shortLocationName(displayName: string): string {
  const parts = displayName.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.slice(0, 2).join(', ') || displayName;
}

async function fetchGeocode<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new Error('Cannot reach the geocoding service. Make sure the backend is running (npm run backend).');
  }

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
      const body = JSON.parse(text) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // use raw response text
    }
    throw new Error(message || 'Geocoding request failed');
  }

  return response.json() as Promise<T>;
}

export async function reverseGeocode(point: Coordinates): Promise<string> {
  try {
    const data = await fetchGeocode<GeocodeApiResult>(
      `/api/geocode/reverse?latitude=${encodeURIComponent(point.latitude)}&longitude=${encodeURIComponent(point.longitude)}`,
    );
    return data.displayName || 'Live GPS location';
  } catch {
    return 'Live GPS location';
  }
}

export async function forwardGeocode(address: string): Promise<Coordinates> {
  const trimmedAddress = address.trim();
  if (!trimmedAddress) {
    throw new Error('Address is required for geocoding');
  }

  const data = await fetchGeocode<GeocodeApiResult>(
    `/api/geocode/forward?address=${encodeURIComponent(trimmedAddress)}`,
  );

  return {
    latitude: data.latitude,
    longitude: data.longitude,
  };
}
