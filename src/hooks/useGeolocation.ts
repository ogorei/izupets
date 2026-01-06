import { useQuery } from '@tanstack/react-query';

interface GeolocationPosition {
  lat: number;
  lng: number;
}

interface UseGeolocationOptions {
  enabled?: boolean;
  onSuccess?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationPositionError) => void;
}

/**
 * Custom hook for geolocation using TanStack Query.
 * Caches the user's location and prevents duplicate requests.
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { enabled = false, onSuccess, onError } = options;

  return useQuery({
    queryKey: ['geolocation'],
    queryFn: (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            resolve(location);
            onSuccess?.(location);
          },
          (error) => {
            reject(error);
            onError?.(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    },
    enabled,
    // Location is considered fresh for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Cache location for 10 minutes
    gcTime: 1000 * 60 * 10,
    // Don't retry on error (user denied, etc.)
    retry: false,
    // Don't refetch automatically
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

