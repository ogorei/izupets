import { fetchPlaces } from '../../../../sanity/lib/fetch';
import MapClient from '@/components/map/MapClient';

export default async function MapPage({ params: { locale } }: { params: { locale: string } }) {
  const places = await fetchPlaces();

  // Filter places that have valid location data with coordinates
  const placesWithLocation = places.filter(
    (place: any) => 
      place.location && 
      typeof place.location.lat === 'number' && 
      typeof place.location.lng === 'number' &&
      !isNaN(place.location.lat) &&
      !isNaN(place.location.lng)
  );

  return (
    <div className="min-h-screen">
      <MapClient places={placesWithLocation} locale={locale as 'en' | 'ja'} />
    </div>
  );
}

