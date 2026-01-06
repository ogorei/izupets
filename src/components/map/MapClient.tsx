'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { MapPin, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleMap } from '@react-google-maps/api';
import { useMarkerLibrary } from '@/hooks/useMarkerLibrary';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQueryClient } from '@tanstack/react-query';

interface Place {
  _id: string;
  title: {
    en?: string;
    ja?: string;
  };
  slug: {
    current: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  address?: {
    ja?: string;
    en?: string;
    full?: string;
  };
  category?: {
    title?: {
      en?: string;
      ja?: string;
    };
  };
  imageURL?: string;
}

interface Props {
  places: Place[];
  locale: 'en' | 'ja';
}

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '600px',
  minHeight: '600px',
  display: 'block',
};

const defaultCenter = {
  lat: 34.9,
  lng: 139.0,
};

const defaultZoom = 10;

// Storage keys for persistence
const STORAGE_KEY_MAP_STATE = 'map-client-state';

/**
 * Gets persistent map state from sessionStorage
 */
function getPersistentMapState(): { center: { lat: number; lng: number }; zoom: number } {
  if (typeof window === 'undefined') {
    return { center: defaultCenter, zoom: defaultZoom };
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_MAP_STATE);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the stored data
      if (
        parsed?.center?.lat &&
        parsed?.center?.lng &&
        typeof parsed.zoom === 'number'
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load persistent map state:', error);
  }

  return { center: defaultCenter, zoom: defaultZoom };
}

/**
 * Saves map state to sessionStorage
 */
function savePersistentMapState(center: { lat: number; lng: number }, zoom: number) {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(
      STORAGE_KEY_MAP_STATE,
      JSON.stringify({ center, zoom })
    );
  } catch (error) {
    console.warn('Failed to save persistent map state:', error);
  }
}

/**
 * Checks if Google Maps API script is already in the DOM and fully loaded.
 */
function isGoogleMapsScriptLoaded(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if API is actually available and ready (not just script tag exists)
  const apiAvailable = !!(window as any).google?.maps;

  // Also check if the Map constructor is available (indicates API is fully loaded)
  const mapConstructorAvailable = !!(window as any).google?.maps?.Map;

  return apiAvailable && mapConstructorAvailable;
}

/**
 * Creates InfoWindow content using DOM APIs (safe, no XSS).
 */
function createInfoWindowContent(
  place: Place,
  locale: 'en' | 'ja',
  t: (key: string) => string,
  onViewDetails: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.style.minWidth = '200px';

  // Get title with proper fallback
  const titleText =
    locale === 'ja'
      ? place.title?.ja || place.title?.en || 'Untitled'
      : place.title?.en || place.title?.ja || 'Untitled';

  const title = document.createElement('h3');
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '8px';
  title.style.fontSize = '14px';
  title.textContent = titleText;
  container.appendChild(title);

  // Get address with proper locale handling and fallback
  const addressText =
    place.address?.full ||
    (locale === 'ja'
      ? place.address?.ja || place.address?.en || ''
      : place.address?.en || place.address?.ja || '');

  if (addressText) {
    const address = document.createElement('p');
    address.style.fontSize = '12px';
    address.style.color = '#666';
    address.style.marginBottom = '8px';
    address.textContent = addressText;
    container.appendChild(address);
  }

  // Get category with proper locale handling
  if (place.category?.title) {
    const categoryText =
      locale === 'ja'
        ? place.category.title.ja || place.category.title.en || ''
        : place.category.title.en || place.category.title.ja || '';

    if (categoryText) {
      const category = document.createElement('p');
      category.style.fontSize = '11px';
      category.style.color = '#999';
      category.style.marginBottom = '8px';
      category.textContent = categoryText;
      container.appendChild(category);
    }
  }

  const button = document.createElement('button');
  button.style.background = '#3b82f6';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.padding = '6px 12px';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.fontSize = '12px';
  button.style.width = '100%';
  button.style.marginTop = '8px';
  button.textContent = t('viewDetails');

  // Use a wrapper to ensure cleanup
  const handleClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails();
  };

  button.addEventListener('click', handleClick);
  container.appendChild(button);

  return container;
}

export default function MapClient({ places, locale }: Props) {
  const t = useTranslations('Map');
  const router = useRouter();
  const queryClient = useQueryClient();

  // Environment variables (declared early for use in useEffect)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

  // ============================================================================
  // React State: UI-only
  // ============================================================================
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [mapState, setMapState] = useState(getPersistentMapState);
  const [requestLocationEnabled, setRequestLocationEnabled] = useState(false);

  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const placeMarkersMapRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | undefined>();
  const lastPlacesDataRef = useRef<string>('');
  const lastUserLocationRef = useRef<string>('');
  const hasFittedBoundsRef = useRef<boolean>(false);

  // ============================================================================
  // TanStack Query Hooks
  // ============================================================================
  // Load marker library (cached and deduped by TanStack Query)
  // Only enable after script is loaded and map is ready
  const {
    data: markerLibrary,
    isLoading: isMarkerLibraryLoading,
    error: markerLibraryError,
  } = useMarkerLibrary(isMapReady && isGoogleMapsScriptLoaded());

  // Geolocation (only enabled when user clicks button)
  const {
    data: userLocation,
    isLoading: isGeolocationLoading,
    error: geolocationError,
    refetch: refetchGeolocation,
  } = useGeolocation({
    enabled: requestLocationEnabled,
    onSuccess: (location) => {
      // Update map center when location is obtained
      if (mapRef.current) {
        mapRef.current.setCenter(location);
        mapRef.current.setZoom(13);
      }
    },
    onError: (err) => {
      console.warn('Geolocation error:', err);
      setError(t('locationDenied'));
      setRequestLocationEnabled(false);
    },
  });

  // Filter places with valid coordinates
  const placesWithLocation = useMemo(
    () =>
      places.filter(
        (place) =>
          place.location &&
          typeof place.location.lat === 'number' &&
          typeof place.location.lng === 'number'
      ),
    [places]
  );

  // Create a stable identity string for places data
  const placesDataIdentity = useMemo(() => {
    return placesWithLocation
      .map((place) => `${place._id}:${place.location.lat}:${place.location.lng}`)
      .sort()
      .join('|');
  }, [placesWithLocation]);

  // Create a stable identity string for user location
  const userLocationIdentity = useMemo(() => {
    if (!userLocation) return '';
    return `${userLocation.lat}:${userLocation.lng}`;
  }, [userLocation]);

  // ============================================================================
  // Place Click Handler: Creates fresh InfoWindow
  // ============================================================================
  const handlePlaceClick = useCallback(
    (place: Place) => {
      // Validate place data
      if (
        !place ||
        !place.location ||
        !place.location.lat ||
        !place.location.lng
      ) {
        console.error('Invalid place data:', place);
        return;
      }

      setSelectedPlace(place);

      if (!mapRef.current) return;

      // Close existing info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }

      // Create fresh InfoWindow
      const infoWindow = new google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;

      const onViewDetails = () => {
        // Validate slug before navigation
        if (place.slug?.current) {
          router.push(`/${locale}/places/${place.slug.current}`);
        } else {
          console.error('Place missing slug:', place);
        }
      };

      try {
        const content = createInfoWindowContent(place, locale, t, onViewDetails);
        infoWindow.setContent(content);
        infoWindow.setPosition({
          lat: place.location.lat,
          lng: place.location.lng,
        });
        infoWindow.open(mapRef.current);

        // Clean up on close
        google.maps.event.addListenerOnce(infoWindow, 'closeclick', () => {
          setSelectedPlace(null);
          infoWindowRef.current = null;
        });
      } catch (error) {
        console.error('Error creating InfoWindow:', error);
        setError(t('mapLoadError') || 'Failed to display place information');
      }
    },
    [locale, t, router]
  );

  // ============================================================================
  // Marker Creation/Update: Uses cached marker library from TanStack Query
  // Only creates/updates markers when data identity changes
  // ============================================================================
  const updateMarkers = useCallback(
    async (map: google.maps.Map) => {
      // Wait for marker library to be available
      if (!markerLibrary) {
        console.log('Marker library not yet available, skipping marker update');
        return;
      }

      // Double-check that we have the required components
      if (!markerLibrary.AdvancedMarkerElement || !markerLibrary.PinElement) {
        console.error('Marker library missing required components');
        return;
      }

      const { AdvancedMarkerElement, PinElement } = markerLibrary;

      // Update user location marker only if location changed
      if (userLocationIdentity !== lastUserLocationRef.current) {
        // Remove old user marker if it exists
        if (userMarkerRef.current) {
          userMarkerRef.current.map = null;
          userMarkerRef.current = null;
        }

        // Create new user marker if location exists
        if (userLocation) {
          const userPin = new PinElement({
            background: '#3b82f6',
            borderColor: '#ffffff',
            glyphColor: '#ffffff',
            scale: 1.2,
          });

          const userMarker = new AdvancedMarkerElement({
            map,
            position: { lat: userLocation.lat, lng: userLocation.lng },
            content: userPin.element,
            title: t('yourLocation'),
          });

          userMarkerRef.current = userMarker;
          lastUserLocationRef.current = userLocationIdentity;
        } else {
          lastUserLocationRef.current = '';
        }
      }

      // Update place markers only if places data identity changed
      if (placesDataIdentity !== lastPlacesDataRef.current) {
        // Get current place IDs
        const currentPlaceIds = new Set(
          placesWithLocation.map((place) => place._id)
        );

        // Remove markers for places that no longer exist
        placeMarkersMapRef.current.forEach((marker, placeId) => {
          if (!currentPlaceIds.has(placeId)) {
            marker.map = null;
            placeMarkersMapRef.current.delete(placeId);
          }
        });

        // Create or update markers for current places
        placesWithLocation.forEach((place) => {
          try {
            // Validate place data
            if (
              !place ||
              !place.location ||
              !place.location.lat ||
              !place.location.lng
            ) {
              console.warn('Skipping invalid place:', place);
              return;
            }

            const existingMarker = placeMarkersMapRef.current.get(place._id);

            // If marker exists, we only need to update if data identity changed
            // (which we already checked at the outer level)
            // So if we reach here, the marker needs to be updated
            if (existingMarker) {
              // Remove old marker
              existingMarker.map = null;
              placeMarkersMapRef.current.delete(place._id);
            }

            // Create new marker
            const placeName =
              locale === 'ja'
                ? place.title?.ja || place.title?.en || 'Untitled'
                : place.title?.en || place.title?.ja || 'Untitled';

            const placePin = new PinElement({
              background: '#ef4444',
              borderColor: '#ffffff',
              glyphColor: '#ffffff',
              scale: 1.0,
            });

            const placeMarker = new AdvancedMarkerElement({
              map,
              position: {
                lat: place.location.lat,
                lng: place.location.lng,
              },
              content: placePin.element,
              title: placeName,
            });

            placeMarker.addListener('click', () => {
              handlePlaceClick(place);
            });

            placeMarkersMapRef.current.set(place._id, placeMarker);
          } catch (error) {
            console.error('Error creating marker for place:', place, error);
          }
        });

        // Update markersRef array for compatibility
        markersRef.current = [
          ...(userMarkerRef.current ? [userMarkerRef.current] : []),
          ...Array.from(placeMarkersMapRef.current.values()),
        ];

        lastPlacesDataRef.current = placesDataIdentity;
      }

      // Fit bounds with smart centering (only on initial load)
      if (!hasFittedBoundsRef.current && (placesWithLocation.length > 0 || userLocation)) {
        const bounds = new google.maps.LatLngBounds();

        // Always include user location if available
        if (userLocation) {
          bounds.extend(
            new google.maps.LatLng(userLocation.lat, userLocation.lng)
          );
        }

        // Add all places to bounds
        placesWithLocation.forEach((place) => {
          bounds.extend(
            new google.maps.LatLng(place.location.lat, place.location.lng)
          );
        });

        // If user location exists, prioritize showing nearby places
        if (userLocation && placesWithLocation.length > 0) {
          // Calculate simple distance (Haversine) to filter nearby places
          const calculateDistance = (
            lat1: number,
            lng1: number,
            lat2: number,
            lng2: number
          ) => {
            const R = 6371e3; // Earth radius in meters
            const φ1 = (lat1 * Math.PI) / 180;
            const φ2 = (lat2 * Math.PI) / 180;
            const Δφ = ((lat2 - lat1) * Math.PI) / 180;
            const Δλ = ((lng2 - lng1) * Math.PI) / 180;
            const a =
              Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) *
                Math.cos(φ2) *
                Math.sin(Δλ / 2) *
                Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          // Filter to nearby places (within ~50km)
          const nearbyPlaces = placesWithLocation.filter((place) => {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              place.location.lat,
              place.location.lng
            );
            return distance < 50000; // 50km in meters
          });

          // If we have nearby places, fit bounds to those + user location
          if (nearbyPlaces.length > 0) {
            const nearbyBounds = new google.maps.LatLngBounds();
            nearbyBounds.extend(
              new google.maps.LatLng(userLocation.lat, userLocation.lng)
            );
            nearbyPlaces.forEach((place) => {
              nearbyBounds.extend(
                new google.maps.LatLng(place.location.lat, place.location.lng)
              );
            });
            // Add padding to make nearby places more visible
            map.fitBounds(nearbyBounds, {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50,
            });
          } else {
            // No nearby places, center on user with reasonable zoom
            map.setCenter(userLocation);
            map.setZoom(13);
          }
        } else if (userLocation) {
          // Only user location, no places - center on user
          map.setCenter(userLocation);
          map.setZoom(13);
        } else {
          // No user location, fit all places with padding
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
      } else if (placesWithLocation.length > 0) {
        // Fallback: if no user location but we have places, fit bounds
        const bounds = new google.maps.LatLngBounds();
        placesWithLocation.forEach((place) => {
          bounds.extend(
            new google.maps.LatLng(place.location.lat, place.location.lng)
          );
        });
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        hasFittedBoundsRef.current = true;
      }
    },
    [
      markerLibrary,
      userLocation,
      userLocationIdentity,
      placesWithLocation,
      placesDataIdentity,
      locale,
      t,
      handlePlaceClick,
    ]
  );

  // ============================================================================
  // Request Location: Manual geolocation request
  // ============================================================================
  const requestLocation = useCallback(() => {
    setRequestLocationEnabled(true);
    refetchGeolocation();
  }, [refetchGeolocation]);

  // ============================================================================
  // Map Load Handler: Restores state from sessionStorage
  // ============================================================================
  const onMapLoad = useCallback(
    async (map: google.maps.Map) => {
      try {
        console.log('Map loaded successfully!', map);
        mapRef.current = map;

        setIsMapReady(true);
        setIsLoading(false);

        // Verify map is actually visible
        const mapDiv = map.getDiv();
        if (mapDiv) {
          console.log('Map container dimensions:', {
            width: mapDiv.offsetWidth,
            height: mapDiv.offsetHeight,
            display: window.getComputedStyle(mapDiv).display,
          });

          // Force a resize if dimensions are 0
          if (mapDiv.offsetWidth === 0 || mapDiv.offsetHeight === 0) {
            console.warn(
              'Map container has zero dimensions, triggering resize'
            );
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
              google.maps.event.trigger(map, 'resize');
            }, 100);
          }
        }

        // Set initial state immediately (no delay needed)
        try {
          // Only restore persistent state if we don't have user location (user location takes priority)
          if (!userLocation) {
            // Check if persistent state is different from default (user has navigated before)
            const isDefaultState =
              mapState.center.lat === defaultCenter.lat &&
              mapState.center.lng === defaultCenter.lng &&
              mapState.zoom === defaultZoom;

            if (!isDefaultState) {
              // User has navigated before, restore their view
              map.setCenter(mapState.center);
              map.setZoom(mapState.zoom);
            } else {
              // First visit, use default center
              map.setCenter(defaultCenter);
              map.setZoom(defaultZoom);
            }
          }

          // Update markers after state is set (will wait for marker library)
          // Use requestAnimationFrame to ensure map is fully rendered
          requestAnimationFrame(() => {
            updateMarkers(map);
          });
        } catch (err) {
          console.error('Error setting up map:', err);
          setError(
            t('mapLoadError') || 'Failed to initialize map markers'
          );
        }

        // Snapshot map state on idle (debounced)
        const idleListener = map.addListener('idle', () => {
          if (idleTimeoutRef.current) {
            clearTimeout(idleTimeoutRef.current);
          }
          idleTimeoutRef.current = setTimeout(() => {
            const center = map.getCenter();
            if (center) {
              const newState = {
                center: { lat: center.lat(), lng: center.lng() },
                zoom: map.getZoom() || defaultZoom,
              };
              setMapState(newState);
              savePersistentMapState(newState.center, newState.zoom);
            }
          }, 500);
        });

        // Store listener for cleanup
        (map as any)._idleListener = idleListener;
      } catch (err) {
        console.error('Error loading map:', err);
        setError(t('mapLoadError') || 'Failed to load map');
        setIsLoading(false);
      }
    },
    [updateMarkers, t, userLocation, mapState]
  );

  // ============================================================================
  // Update Markers: Only when data identity changes
  // ============================================================================
  useEffect(() => {
    if (isMapReady && mapRef.current && markerLibrary) {
      // Only update if data identity actually changed
      const shouldUpdate =
        placesDataIdentity !== lastPlacesDataRef.current ||
        userLocationIdentity !== lastUserLocationRef.current;

      if (shouldUpdate) {
        updateMarkers(mapRef.current);
      }
    }
  }, [
    placesDataIdentity,
    userLocationIdentity,
    isMapReady,
    markerLibrary,
    updateMarkers,
  ]);

  // ============================================================================
  // Monitor script loading status and add timeout for map loading
  // ============================================================================
  useEffect(() => {
    // Check if script is loaded on mount and after a short delay
    const checkScript = () => {
      if (isGoogleMapsScriptLoaded()) {
        setIsScriptLoading(false);
      }
    };

    checkScript();
    const timeout = setTimeout(checkScript, 1000);

    // Add a timeout to detect if map never loads (30 seconds)
    const mapLoadTimeout = setTimeout(() => {
      if (!isMapReady) {
        console.error('Map failed to load within 30 seconds');
        setError(
          t('mapLoadError') ||
            'Map is taking too long to load. Please check your API key and refresh the page.'
        );
        setIsLoading(false);
      }
    }, 30000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(mapLoadTimeout);
    };
  }, [isMapReady, t]);

  // ============================================================================
  // Cleanup on unmount
  // ============================================================================
  useEffect(() => {
    return () => {
      // Clear any pending timeout
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      // Cleanup all markers
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
      placeMarkersMapRef.current.forEach((marker) => {
        marker.map = null;
      });
      placeMarkersMapRef.current.clear();
      markersRef.current = [];

      if (mapRef.current) {
        // Cleanup idle listener
        const idleListener = (mapRef.current as any)._idleListener;
        if (idleListener) {
          google.maps.event.removeListener(idleListener);
        }

        // Final snapshot of map state
        const center = mapRef.current.getCenter();
        if (center) {
          const finalState = {
            center: { lat: center.lat(), lng: center.lng() },
            zoom: mapRef.current.getZoom() || defaultZoom,
          };
          savePersistentMapState(finalState.center, finalState.zoom);
        }
      }
    };
  }, []);

  // ============================================================================
  // Manual Script Loading: Load Google Maps script manually
  // ============================================================================
  useEffect(() => {
    // Check if script is already loaded
    if (isGoogleMapsScriptLoaded()) {
      setIsScriptLoading(false);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      // Script is loading, wait for it (check less frequently to reduce overhead)
      const checkInterval = setInterval(() => {
        if (isGoogleMapsScriptLoaded()) {
          setIsScriptLoading(false);
          clearInterval(checkInterval);
        }
      }, 200);

      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!isGoogleMapsScriptLoaded()) {
          setError(t('mapLoadError') || 'Google Maps API failed to load');
          setIsScriptLoading(false);
        }
      }, 30000);

      return () => clearInterval(checkInterval);
    }

    // Load the script
    setIsScriptLoading(true);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${
      mapId ? `&map_ids=${mapId}` : ''
    }&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      // Check immediately, API should be ready
      if (isGoogleMapsScriptLoaded()) {
        setIsScriptLoading(false);
        console.log('Google Maps API is available');
      } else {
        // If not immediately available, check once more after a short delay
        setTimeout(() => {
          if (isGoogleMapsScriptLoaded()) {
            setIsScriptLoading(false);
            console.log('Google Maps API is available');
          } else {
            console.error('Google Maps API not available after script load');
            setError(t('mapLoadError') || 'Google Maps API failed to load');
            setIsScriptLoading(false);
          }
        }, 50);
      }
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      setError(t('mapLoadError') || 'Failed to load Google Maps script');
      setIsScriptLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove the script on unmount as it might be used by other components
      // Just clean up the loading state
    };
  }, [apiKey, mapId, t]);

  // ============================================================================
  // Error handling from TanStack Query
  // ============================================================================
  useEffect(() => {
    if (markerLibraryError) {
      console.error('Marker library error:', markerLibraryError);
      // Only show error if we've actually tried to load it (not just disabled)
      if (isMapReady && isGoogleMapsScriptLoaded()) {
        setError(t('mapLoadError') || 'Failed to load marker library');
      }
    }
  }, [markerLibraryError, t, isMapReady]);

  // Debug: Log environment variables (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Map Client Debug:', {
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey.length,
        hasMapId: !!mapId,
        mapId: mapId,
        isScriptLoaded: isGoogleMapsScriptLoaded(),
        markerLibraryLoaded: !!markerLibrary,
        userLocation: userLocation,
      });
    }
  }, [apiKey, mapId, markerLibrary, userLocation]);

  if (!apiKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-800 font-medium mb-1">
              Google Maps API key is not configured for the map.
            </p>
            <p className="text-xs text-red-700">
              Please add{' '}
              <code className="bg-red-100 px-1 rounded">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              </code>{' '}
              to your{' '}
              <code className="bg-red-100 px-1 rounded">.env.local</code> file.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Determine loading state
  // Only show loading for marker library if map is ready (to avoid premature loading state)
  const isLoadingMap =
    isLoading ||
    isScriptLoading ||
    (isMapReady && isMarkerLibraryLoading) ||
    (requestLocationEnabled && isGeolocationLoading);

  if (isLoadingMap && !userLocation) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gray-600">
            {requestLocationEnabled && isGeolocationLoading
              ? t('requestingLocation')
              : t('loadingMap')}
          </p>
        </div>
      </div>
    );
  }

  // Determine location permission state
  const locationPermission = userLocation
    ? 'granted'
    : geolocationError
      ? 'denied'
      : 'prompt';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-petBrown-dark mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600">
          {t('subtitle')} {placesWithLocation.length} {t('placesFound')}
        </p>
      </div>

      {locationPermission === 'prompt' && !userLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-medium mb-1">
              {t('enableLocation') || 'Enable Location'}
            </p>
            <p className="text-xs text-blue-700">
              {t('enableLocationDescription') ||
                'Click the button below to show your location on the map and find nearby pet-friendly places.'}
            </p>
          </div>
          <button
            onClick={requestLocation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
          >
            <Navigation className="w-4 h-4" />
            {t('enableLocation') || 'Enable Location'}
          </button>
        </div>
      )}

      {locationPermission === 'denied' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-800 font-medium mb-1">
              {t('locationDenied')}
            </p>
            <p className="text-xs text-yellow-700">
              {t('locationDeniedDescription')}
            </p>
          </div>
          <button
            onClick={requestLocation}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            <Navigation className="w-4 h-4" />
            {t('enableLocation')}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="relative mb-6">
        <div
          className="w-full rounded-lg border border-gray-200 shadow-lg overflow-hidden"
          style={{ minHeight: '600px', position: 'relative' }}
        >
          {isScriptLoading && (
            <div className="h-[600px] flex items-center justify-center bg-gray-50 absolute inset-0 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="ml-3 text-gray-600">{t('loadingMap')}</p>
            </div>
          )}
          {!isScriptLoading && isGoogleMapsScriptLoaded() && (
            <div
              style={{
                width: '100%',
                height: '600px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapState.center}
                zoom={mapState.zoom}
                onLoad={onMapLoad}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                  ...(mapId && { mapId: mapId }),
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-sm font-medium text-blue-900">
              {t('yourLocation')}
            </span>
          </div>
          <p className="text-xs text-blue-700">{t('yourLocationDescription')}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-sm font-medium text-red-900">
              {t('petFriendlyPlaces')}
            </span>
          </div>
          <p className="text-xs text-red-700">
            {t('petFriendlyPlacesDescription')}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {t('totalPlaces')}
            </span>
          </div>
          <p className="text-xs text-gray-700">
            {placesWithLocation.length} {t('places')}
          </p>
        </div>
      </div>
    </div>
  );
}
