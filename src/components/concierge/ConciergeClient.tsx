'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { PetFriendlyLocation } from '../../../types';
import { useTranslations } from 'next-intl';
import ProductCard from '../product/ProductCard';
import PlacesFilter from '../shared/PlacesFilter';
import Pagination from '../shared/Pagination';

type Locale = 'en' | 'ja';

interface Props {
  initialLocations: PetFriendlyLocation[];
  locale: Locale;
}

const ITEMS_PER_PAGE = 10;

export default function ConciergeClient({ initialLocations, locale }: Props) {
  const [filteredPlaces, setFilteredPlaces] = useState<PetFriendlyLocation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('Concierge');

  // Get current page from URL params
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    setCurrentPage(page);
  }, [searchParams]);

  // Initialize with all places when no filters are applied
  useEffect(() => {
    setFilteredPlaces(initialLocations);
  }, [initialLocations]);

  const handleProductClick = (slug: string) => {
    router.push(`/${locale}/places/${slug}`);
  };

  const handleFilterChange = (filteredProducts: PetFriendlyLocation[]) => {
    setFilteredPlaces(filteredProducts);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPlaces = filteredPlaces.slice(startIndex, endIndex);

  // Build search params for pagination
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'page') {
        params.set(key, value);
      }
    });
    return Object.fromEntries(params.entries());
  };

  // Ensure we always have an array to work with
  const safeInitialLocations = initialLocations || [];
  const safeCurrentPlaces = currentPlaces || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="md:col-span-1">
          <PlacesFilter
            places={safeInitialLocations}
            onFilterChange={handleFilterChange}
            locale={locale}
          />
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-petBrown-dark mb-2">
              {t('allPlaces')}
            </h2>
            <p className="text-gray-600">
              {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredPlaces.length)} {t('of')} {filteredPlaces.length} {t('places')}
            </p>
          </div>

          {safeCurrentPlaces.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('noResults')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeCurrentPlaces.map((location) => (
                  <div
                    key={location._id}
                    onClick={() => handleProductClick(location.slug.current)}
                    className="cursor-pointer h-full"
                  >
                    <ProductCard 
                      location={location} 
                      minimal={true} 
                      locale={locale} 
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                locale={locale}
                basePath="/concierge"
                searchParams={buildSearchParams()}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
} 