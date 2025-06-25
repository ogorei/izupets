import { fetchProducts } from '../../../../sanity/lib/fetch';
import ConciergeClient from '@/components/concierge/ConciergeClient';
import ConciergeLayout from '@/components/concierge/ConciergeLayout';

export default async function Concierge({ params: { locale } }: { params: { locale: string } }) {
  const products = await fetchProducts();

  return (
    <ConciergeLayout>
      <ConciergeClient initialProducts={products} locale={locale as 'en' | 'ja'} />
    </ConciergeLayout>
  );
}
