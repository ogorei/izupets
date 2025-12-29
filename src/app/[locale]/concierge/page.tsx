import { fetchPlaces } from '../../../../sanity/lib/fetch';
import ConciergeClient from '@/components/concierge/ConciergeClient';
import ConciergeLayout from '@/components/concierge/ConciergeLayout';

export default async function Concierge({ params: { locale } }: { params: { locale: string } }) {
  const places = await fetchPlaces();

  return (
    <ConciergeLayout>
      <ConciergeClient initialLocations={places} locale={locale as 'en' | 'ja'} />
    </ConciergeLayout>
  );
}
