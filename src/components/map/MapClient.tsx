'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { MapPin, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

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

interface UserLocation {
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 34.9,
  lng: 139.0,
};

const defaultZoom = 10;

export default function MapClient({ places, locale }: Props) {
  const t = useTranslations('Map');
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(defaultZoom);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Filter places with valid coordinates
  const placesWithLocation = places.filter(
    (place) => place.location && typeof place.location.lat === 'number' && typeof place.location.lng === 'number'
  );

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          setLocationPermission('granted');
          setMapCenter(userLoc);
          setMapZoom(13);
          setIsLoading(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setLocationPermission('denied');
          setIsLoading(false);
          // Still show map with default center
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError(t('geolocationNotSupported'));
      setIsLoading(false);
    }
  }, [t]);

  // Helper function to create markers
  const createMarkers = async (map: google.maps.Map) => {
    if (typeof window === 'undefined' || !(window as any).google) return;
    
    const { AdvancedMarkerElement, PinElement } = await (window as any).google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];
    
    // Create user location marker if available
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
      
      markersRef.current.push(userMarker);
    }
    
    // Create place markers
    placesWithLocation.forEach((place) => {
      const placeName = locale === 'ja' 
        ? place.title.ja || place.title.en 
        : place.title.en || place.title.ja;
      
      const placePin = new PinElement({
        background: '#ef4444',
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        scale: 1.0,
      });
      
      const placeMarker = new AdvancedMarkerElement({
        map,
        position: { lat: place.location.lat, lng: place.location.lng },
        content: placePin.element,
        title: placeName,
      });
      
      // Add click handler
      placeMarker.addListener('click', () => {
        handlePlaceClick(place);
      });
      
      markersRef.current.push(placeMarker);
    });
    
    // Fit bounds after markers are created
    if (placesWithLocation.length > 0 || userLocation) {
      const bounds = new google.maps.LatLngBounds();
      
      if (userLocation) {
        bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
      }
      
      placesWithLocation.forEach((place) => {
        bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng));
      });
      
      map.fitBounds(bounds);
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          setLocationPermission('granted');
          setMapCenter(userLoc);
          setMapZoom(13);
          setIsLoading(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setLocationPermission('denied');
          setIsLoading(false);
          setError(t('locationDenied'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  const onMapLoad = async (map: google.maps.Map) => {
    mapRef.current = map;
    await createMarkers(map);
    setIsMapLoaded(true);
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    
    // Create or update info window
    if (mapRef.current && typeof window !== 'undefined' && (window as any).google) {
      const google = (window as any).google;
      const placeName = locale === 'ja' 
        ? place.title.ja || place.title.en 
        : place.title.en || place.title.ja;
      
      const content = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${placeName}</h3>
          ${place.address?.ja ? `<p style="font-size: 12px; color: #666; margin-bottom: 8px;">${place.address.ja}</p>` : ''}
          ${place.category?.title ? `<p style="font-size: 11px; color: #999; margin-bottom: 8px;">${locale === 'ja' ? place.category.title.ja : place.category.title.en}</p>` : ''}
          <button onclick="window.location.href='/${locale}/places/${place.slug.current}'" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%;">
            ${t('viewDetails')}
          </button>
        </div>
      `;
      
      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow();
      }
      
      const infoWindow = infoWindowRef.current;
      if (infoWindow && mapRef.current) {
        infoWindow.setContent(content);
        infoWindow.setPosition({ lat: place.location.lat, lng: place.location.lng });
        infoWindow.open(mapRef.current);
        
        // Close info window when close button is clicked
        google.maps.event.addListenerOnce(infoWindow, 'closeclick', () => {
          setSelectedPlace(null);
        });
      }
    }
  };

  const handleInfoWindowClose = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    setSelectedPlace(null);
  };

  const handleMarkerClick = (place: Place) => {
    router.push(`/${locale}/places/${place.slug.current}`);
  };

  // Update markers when places or user location changes (after initial load)
  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      createMarkers(mapRef.current);
    }
  }, [placesWithLocation, userLocation, locale, isMapLoaded, t]);

  // For client-side Google Maps, we need NEXT_PUBLIC_ prefix
  // For server-side geocoding, GOOGLE_MAPS_API_KEY is used
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

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
              Please add <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-red-100 px-1 rounded">.env.local</code> file.
              Note: This is different from <code className="bg-red-100 px-1 rounded">GOOGLE_MAPS_API_KEY</code> used for server-side geocoding.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!mapId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-800 font-medium mb-1">
              Google Maps Map ID is required for AdvancedMarkerElement.
            </p>
            <p className="text-xs text-yellow-700">
              Please add <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID</code> to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
              You can create a Map ID in the <a href="https://console.cloud.google.com/google/maps-apis" className="underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && locationPermission === 'prompt') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gray-600">{t('requestingLocation')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-petBrown-dark mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600">
          {t('subtitle')} {placesWithLocation.length} {t('placesFound')}
        </p>
      </div>

      {/* Location Permission Banner */}
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Map Container */}
      <div className="relative mb-6">
        <div className="w-full rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={onMapLoad}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                mapId: mapId, // Required for AdvancedMarkerElement
              }}
            >
              {/* Markers are created programmatically in onMapLoad */}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-sm font-medium text-blue-900">{t('yourLocation')}</span>
          </div>
          <p className="text-xs text-blue-700">{t('yourLocationDescription')}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-sm font-medium text-red-900">{t('petFriendlyPlaces')}</span>
          </div>
          <p className="text-xs text-red-700">{t('petFriendlyPlacesDescription')}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{t('totalPlaces')}</span>
          </div>
          <p className="text-xs text-gray-700">{placesWithLocation.length} {t('places')}</p>
        </div>
      </div>
    </div>
  );
}
