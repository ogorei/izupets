'use client';

import { useState } from 'react';
import { Product } from '../../../types';
import ProductCard from '../product/ProductCard';
import ProductFilter from './ProductFilter';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

type Locale = 'en' | 'ja';

interface Props {
  initialProducts: Product[];
  locale: Locale;
}

export default function ConciergeClient({ initialProducts, locale }: Props) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const router = useRouter();
  const params = useParams();
  const t = useTranslations('Concierge');

  const handleProductClick = (slug: string) => {
    router.push(`/${locale}/product/${slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="md:col-span-1">
          <ProductFilter
            products={initialProducts}
            onFilterChange={setFilteredProducts}
            locale={locale}
          />
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product.slug.current)}
                className="cursor-pointer"
              >
                <ProductCard product={product} minimal={true} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 