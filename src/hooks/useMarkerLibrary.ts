import { useQuery } from '@tanstack/react-query';

/**
 * Checks if Google Maps API is fully loaded and ready to use.
 */
function isGoogleMapsReady(): boolean {
  if (typeof window === 'undefined') return false;
  
  const google = (window as any).google;
  if (!google?.maps) return false;
  
  // Check if Map constructor is available (indicates API is fully loaded)
  if (!google.maps.Map) return false;
  
  // Check if importLibrary is available (needed for marker library)
  if (!google.maps.importLibrary) return false;
  
  return true;
}

/**
 * Custom hook to load and cache the Google Maps marker library.
 * Uses TanStack Query to dedupe requests and cache the result.
 */
export function useMarkerLibrary(enabled: boolean = true) {
  return useQuery({
    queryKey: ['google-maps-marker-library'],
    queryFn: async (): Promise<google.maps.MarkerLibrary> => {
      if (!isGoogleMapsReady()) {
        throw new Error('Google Maps API not fully loaded');
      }

      try {
        const library = await (window as any).google.maps.importLibrary(
          'marker'
        ) as google.maps.MarkerLibrary;

        if (!library || !library.AdvancedMarkerElement || !library.PinElement) {
          throw new Error('Marker library loaded but missing required components');
        }

        return library;
      } catch (error) {
        console.error('Error loading marker library:', error);
        throw error;
      }
    },
    // Marker library never becomes stale - it's a stable API
    staleTime: Infinity,
    // Keep in cache indefinitely
    gcTime: Infinity,
    // Only fetch if API is ready and enabled
    enabled: enabled && isGoogleMapsReady(),
    // Retry up to 3 times with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

