import { fetchPlaces } from '../../../../sanity/lib/fetch';
import MapClient from '@/components/map/MapClient';

export default async function MapPage({ params: { locale } }: { params: { locale: string } }) {
  const places = await fetchPlaces();

  // Filter places that have location data
  const placesWithLocation = places.filter(
    (place: any) => place.location && place.location.lat && place.location.lng
  );

  return (
    <div className="min-h-screen pt-20">
      <MapClient places={placesWithLocation} locale={locale as 'en' | 'ja'} />
    </div>
  );
}

