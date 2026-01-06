'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PetFriendlyLocation } from '../../../types';
import { useTranslations } from 'next-intl';

type Locale = 'en' | 'ja';

interface FilterState {
  // Place type filter (restaurant, hotel, activities)
  placeType: string;
  
  // Price range filter
  priceRange: string;
  
  // Pet types (from petFriendlyFeatures)
  dogsAllowed: boolean;
  catsAllowed: boolean;
  otherPetsAllowed: boolean;
  
  // Size restrictions (from petFriendlyFeatures)
  sizeRestrictions: boolean;
  
  // Requirements (from petFriendlyFeatures)
  leashRequired: boolean;
  
  // Pet fees (from petFriendlyFeatures)
  freePetFees: boolean;
  
  // Pet amenities (from petFriendlyFeatures.petAmenities)
  petBeds: boolean;
  petBowls: boolean;
  petTreats: boolean;
  petToys: boolean;
  petMenu: boolean;
  petWaterStations: boolean;
  petWasteBags: boolean;
  petGrooming: boolean;
  petSitting: boolean;
  petPlayArea: boolean;
  petFriendlyRooms: boolean;
  petReliefArea: boolean;
}

interface Props {
  places: PetFriendlyLocation[];
  onFilterChange: (filteredPlaces: PetFriendlyLocation[]) => void;
  locale: Locale;
}

export default function PlacesFilter({ places, onFilterChange, locale }: Props) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    placeType: '',
    priceRange: '',
    dogsAllowed: false,
    catsAllowed: false,
    otherPetsAllowed: false,
    sizeRestrictions: false,
    leashRequired: false,
    freePetFees: false,
    petBeds: false,
    petBowls: false,
    petTreats: false,
    petToys: false,
    petMenu: false,
    petWaterStations: false,
    petWasteBags: false,
    petGrooming: false,
    petSitting: false,
    petPlayArea: false,
    petFriendlyRooms: false,
    petReliefArea: false,
  });

  const t = useTranslations('PlacesFilter');

  // Get search query from URL params
  const searchQuery = searchParams.get('q') || '';

  // Apply filters when search query or places change
  useEffect(() => {
    filterPlaces(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, places]);

  const handleBooleanChange = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    filterPlaces(newFilters);
  };

  const handleSelectChange = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === 'placeType') {
      console.log('🔍 Place Type filter changed:', {
        selectedPlaceType: value,
        totalPlaces: places.length,
        categorySlugsInData: places.map(p => ({
          name: p.title?.en || p.title?.ja || 'Unknown',
          categorySlug: (p as any).categorySlug || p.category?.slug?.current,
          categoryName: (p.category as any)?.name?.en || (p.category as any)?.name?.ja || (p.category as any)?.title?.en || (p.category as any)?.title?.ja,
          rawPlace: p
        }))
      });
    }
    
    filterPlaces(newFilters);
  };

  // Helper function to check if place matches place type using categorySlug
  const matchesPlaceType = (place: PetFriendlyLocation, placeTypeFilter: string): boolean => {
    if (!placeTypeFilter) return true;
    
    // Use categorySlug for filtering
    const categorySlug = ((place as any).categorySlug || place.category?.slug?.current || '').toLowerCase();
    const placeName = place.title?.en || place.title?.ja || 'Unknown';
    
    if (placeTypeFilter === 'restaurant') {
      // Match restaurant or cafe category slugs
      const matches = (
        categorySlug.includes('restaurant') || 
        categorySlug.includes('cafe')
      );
      if (!matches && categorySlug) {
        console.log(`❌ ${placeName}: categorySlug="${categorySlug}" does not match "restaurant" filter`);
      } else if (matches) {
        console.log(`✅ ${placeName}: categorySlug="${categorySlug}" matches "restaurant" filter`);
      }
      return matches;
    } else if (placeTypeFilter === 'hotel') {
      // Match hotel or accommodation category slugs
      const matches = (
        categorySlug.includes('hotel') || 
        categorySlug.includes('accommodation') ||
        categorySlug.includes('lodging')
      );
      if (!matches && categorySlug) {
        console.log(`❌ ${placeName}: categorySlug="${categorySlug}" does not match "hotel" filter`);
      } else if (matches) {
        console.log(`✅ ${placeName}: categorySlug="${categorySlug}" matches "hotel" filter`);
      }
      return matches;
    } else if (placeTypeFilter === 'activities') {
      // Match all activity-related category slugs
      const matches = (
        categorySlug.includes('activity') || 
        categorySlug.includes('workshop') || 
        categorySlug.includes('experience') ||
        categorySlug.includes('attraction') ||
        categorySlug.includes('museum') ||
        categorySlug.includes('park') ||
        categorySlug.includes('zoo') ||
        categorySlug.includes('pottery') ||
        categorySlug.includes('glasswork') ||
        categorySlug.includes('silversmith') ||
        categorySlug.includes('metalwork') ||
        categorySlug.includes('painting') ||
        categorySlug.includes('craft')
      );
      if (!matches && categorySlug) {
        console.log(`❌ ${placeName}: categorySlug="${categorySlug}" does not match "activities" filter`);
      } else if (matches) {
        console.log(`✅ ${placeName}: categorySlug="${categorySlug}" matches "activities" filter`);
      }
      return matches;
    }
    
    return true;
  };

  // Helper function to check if place matches search query
  const matchesSearchQuery = (place: PetFriendlyLocation, query: string): boolean => {
    if (!query || !query.trim()) return true;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check tags in restaurantDetails
    if (place.restaurantDetails?.tags) {
      const tagMatch = place.restaurantDetails.tags.some(tag => 
        tag.toLowerCase().includes(normalizedQuery)
      );
      if (tagMatch) return true;
    }
    
    // Check title (both English and Japanese)
    const titleEn = place.title?.en?.toLowerCase() || '';
    const titleJa = place.title?.ja?.toLowerCase() || '';
    if (titleEn.includes(normalizedQuery) || titleJa.includes(normalizedQuery)) {
      return true;
    }
    
    // Check genre in restaurantDetails
    const genre = place.restaurantDetails?.genre?.toLowerCase() || '';
    if (genre.includes(normalizedQuery)) {
      return true;
    }
    
    // Check restaurant name
    const restaurantName = place.restaurantDetails?.name?.toLowerCase() || '';
    if (restaurantName.includes(normalizedQuery)) {
      return true;
    }
    
    // Check description (if available)
    const descriptionEn = place.description?.en?.map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child: any) => child.text || '').join(' ');
      }
      return '';
    }).join(' ').toLowerCase() || '';
    const descriptionJa = place.description?.ja?.map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child: any) => child.text || '').join(' ');
      }
      return '';
    }).join(' ').toLowerCase() || '';
    if (descriptionEn.includes(normalizedQuery) || descriptionJa.includes(normalizedQuery)) {
      return true;
    }
    
    return false;
  };

  const filterPlaces = (currentFilters: FilterState) => {
    // Check if any filters are active (including search query)
    const hasActiveFilters = Object.entries(currentFilters).some(([key, value]) => {
      if (key === 'placeType' || key === 'priceRange') return value !== '';
      return value === true;
    });
    const hasSearchQuery = searchQuery && searchQuery.trim() !== '';
    
    // If no filters are active and no search query, return all places
    if (!hasActiveFilters && !hasSearchQuery) {
      console.log('🔍 No active filters, returning all places:', places.length);
      onFilterChange(places);
      return;
    }

    console.log('🔍 Starting filter with:', {
      placeType: currentFilters.placeType,
      priceRange: currentFilters.priceRange,
      searchQuery: searchQuery,
      totalPlaces: places.length
    });

    const filteredPlaces = places.filter((place) => {
      const features = place.petFriendlyFeatures || {};
      const amenities = features.petAmenities || [];

      // Search query filter (check tags, title, genre, etc.)
      if (!matchesSearchQuery(place, searchQuery)) return false;

      // Place type filter
      if (!matchesPlaceType(place, currentFilters.placeType)) return false;

      // Price range filter
      if (currentFilters.priceRange && place.priceRange !== currentFilters.priceRange) return false;

      // Pet types
      if (currentFilters.dogsAllowed && !features.dogsAllowed) return false;
      if (currentFilters.catsAllowed && !features.catsAllowed) return false;
      if (currentFilters.otherPetsAllowed && !features.otherPetsAllowed) return false;

      // Size restrictions (check if place has size restrictions - it's a string field)
      if (currentFilters.sizeRestrictions && (!features.sizeRestrictions || features.sizeRestrictions.trim() === '')) return false;

      // Requirements
      if (currentFilters.leashRequired && !features.leashRequired) return false;

      // Pet fees (check if pet fees are free or not specified)
      if (currentFilters.freePetFees) {
        const petFees = features.petFees || '';
        const isFree = !petFees || petFees.toLowerCase().includes('free') || petFees.toLowerCase().includes('無料') || petFees === '0';
        if (!isFree) return false;
      }

      // Pet amenities
      if (currentFilters.petBeds && !amenities.includes('pet-beds')) return false;
      if (currentFilters.petBowls && !amenities.includes('pet-bowls')) return false;
      if (currentFilters.petTreats && !amenities.includes('pet-treats')) return false;
      if (currentFilters.petToys && !amenities.includes('pet-toys')) return false;
      if (currentFilters.petMenu && !amenities.includes('pet-menu')) return false;
      if (currentFilters.petWaterStations && !amenities.includes('pet-water-stations')) return false;
      if (currentFilters.petWasteBags && !amenities.includes('pet-waste-bags')) return false;
      if (currentFilters.petGrooming && !amenities.includes('pet-grooming')) return false;
      if (currentFilters.petSitting && !amenities.includes('pet-sitting')) return false;
      if (currentFilters.petPlayArea && !amenities.includes('pet-play-area')) return false;
      if (currentFilters.petFriendlyRooms && !amenities.includes('pet-friendly-rooms')) return false;
      if (currentFilters.petReliefArea && !amenities.includes('pet-relief-area')) return false;

      return true;
    });

    console.log('🔍 Filter results:', {
      selectedPlaceType: currentFilters.placeType,
      filteredCount: filteredPlaces.length,
      originalCount: places.length,
      filteredPlaces: filteredPlaces.map(p => ({
        name: p.title?.en || p.title?.ja || 'Unknown',
        categorySlug: (p as any).categorySlug || p.category?.slug?.current
      }))
    });

    onFilterChange(filteredPlaces);
  };

  // Price ranges for dropdown
  const priceRanges = ['$', '$$', '$$$', '$$$$'];

  return (
    <div className="bg-gray-100 p-6 shadow-md sticky top-8 max-h-screen overflow-y-auto">
      <h2 className="text-lg md:text-2xl font-semibold mb-4">{t('title')}</h2>
      <div className="space-y-6">
        {/* Place Type */}
        <div>
          <h3 className="font-medium mb-2">{t('placeType')}</h3>
          <select
            value={filters.placeType}
            onChange={(e) => handleSelectChange('placeType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">{t('allTypes')}</option>
            <option value="restaurant">{locale === 'ja' ? 'レストラン' : 'Restaurant'}</option>
            <option value="hotel">{locale === 'ja' ? 'ホテル' : 'Hotel'}</option>
            <option value="activities">{locale === 'ja' ? 'アクティビティ' : 'Activities'}</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-2">{t('priceRange')}</h3>
          <select
            value={filters.priceRange}
            onChange={(e) => handleSelectChange('priceRange', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">{t('allPrices')}</option>
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Pet Types */}
        <div>
          <h3 className="font-medium mb-2">{t('petTypes')}</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.dogsAllowed}
                onChange={() => handleBooleanChange('dogsAllowed')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('dogsAllowed')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.catsAllowed}
                onChange={() => handleBooleanChange('catsAllowed')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('catsAllowed')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.otherPetsAllowed}
                onChange={() => handleBooleanChange('otherPetsAllowed')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('otherPetsAllowed')}</span>
            </label>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="font-medium mb-2">{t('requirements')}</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.sizeRestrictions}
                onChange={() => handleBooleanChange('sizeRestrictions')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('sizeRestrictions')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.leashRequired}
                onChange={() => handleBooleanChange('leashRequired')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('leashRequired')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.freePetFees}
                onChange={() => handleBooleanChange('freePetFees')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('freePetFees')}</span>
            </label>
          </div>
        </div>

        {/* Pet Amenities */}
        <div>
          <h3 className="font-medium mb-2">{t('petAmenities')}</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petBeds}
                onChange={() => handleBooleanChange('petBeds')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petBeds')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petBowls}
                onChange={() => handleBooleanChange('petBowls')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petBowls')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petTreats}
                onChange={() => handleBooleanChange('petTreats')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petTreats')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petToys}
                onChange={() => handleBooleanChange('petToys')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petToys')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petMenu}
                onChange={() => handleBooleanChange('petMenu')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petMenu')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petWaterStations}
                onChange={() => handleBooleanChange('petWaterStations')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petWaterStations')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petWasteBags}
                onChange={() => handleBooleanChange('petWasteBags')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petWasteBags')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petGrooming}
                onChange={() => handleBooleanChange('petGrooming')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petGrooming')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petSitting}
                onChange={() => handleBooleanChange('petSitting')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petSitting')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petPlayArea}
                onChange={() => handleBooleanChange('petPlayArea')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petPlayArea')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petFriendlyRooms}
                onChange={() => handleBooleanChange('petFriendlyRooms')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petFriendlyRooms')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.petReliefArea}
                onChange={() => handleBooleanChange('petReliefArea')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petReliefArea')}</span>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
} 