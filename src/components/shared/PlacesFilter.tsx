'use client';

import { useState } from 'react';
import { PetFriendlyLocation } from '../../../types';
import { useTranslations } from 'next-intl';

type Locale = 'en' | 'ja';

interface FilterState {
  // Pet types (from petFriendlyFeatures)
  dogsAllowed: boolean;
  catsAllowed: boolean;
  otherPetsAllowed: boolean;
  
  // Requirements (from petFriendlyFeatures)
  leashRequired: boolean;
  
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
  
  // Place type filter
  placeType: string;
  
  // Price range filter
  priceRange: string;
  
  // Rating filter
  minRating: number;
  
  // Featured places only
  featuredOnly: boolean;
}

interface Props {
  places: PetFriendlyLocation[];
  onFilterChange: (filteredPlaces: PetFriendlyLocation[]) => void;
  locale: Locale;
}

export default function PlacesFilter({ places, onFilterChange, locale }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    dogsAllowed: false,
    catsAllowed: false,
    otherPetsAllowed: false,
    leashRequired: false,
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
    placeType: '',
    priceRange: '',
    minRating: 0,
    featuredOnly: false,
  });

  const t = useTranslations('PlacesFilter');

  const handleBooleanChange = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    filterPlaces(newFilters);
  };

  const handleSelectChange = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    filterPlaces(newFilters);
  };

  const filterPlaces = (currentFilters: FilterState) => {
    // Check if any filters are active
    const hasActiveFilters = Object.entries(currentFilters).some(([key, value]) => {
      if (key === 'placeType' || key === 'priceRange') return value !== '';
      if (key === 'minRating') return value > 0;
      if (key === 'featuredOnly') return value === true;
      return value === true;
    });
    
    // If no filters are active, return all places
    if (!hasActiveFilters) {
      onFilterChange(places);
      return;
    }

    const filteredPlaces = places.filter((place) => {
      const features = place.petFriendlyFeatures || {};
      const amenities = features.petAmenities || [];

      // Pet types
      if (currentFilters.dogsAllowed && !features.dogsAllowed) return false;
      if (currentFilters.catsAllowed && !features.catsAllowed) return false;
      if (currentFilters.otherPetsAllowed && !features.otherPetsAllowed) return false;

      // Requirements
      if (currentFilters.leashRequired && !features.leashRequired) return false;

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

      // Place type
      if (currentFilters.placeType && place.placeType !== currentFilters.placeType) return false;

      // Price range
      if (currentFilters.priceRange && place.priceRange !== currentFilters.priceRange) return false;

      // Rating
      if (currentFilters.minRating > 0 && (!place.rating || place.rating < currentFilters.minRating)) return false;

      // Featured only
      if (currentFilters.featuredOnly && !place.featured) return false;

      return true;
    });

    onFilterChange(filteredPlaces);
  };

  // Get unique place types and price ranges for dropdowns
  const placeTypes = Array.from(new Set(places.map(place => place.placeType).filter(Boolean)));
  const priceRanges = ['$', '$$', '$$$', '$$$$'];

  return (
    <div className="bg-gray-100 p-6 shadow-md sticky top-8 max-h-screen overflow-y-auto">
      <h2 className="text-lg md:text-2xl font-semibold mb-4">{t('title')}</h2>
      <div className="space-y-6">
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
                checked={filters.leashRequired}
                onChange={() => handleBooleanChange('leashRequired')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('leashRequired')}</span>
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
                checked={filters.petPlayArea}
                onChange={() => handleBooleanChange('petPlayArea')}
                className="form-checkbox h-4 w-4 accent-petGreen"
              />
              <span className="text-sm">{t('petPlayArea')}</span>
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

        {/* Place Type */}
        <div>
          <h3 className="font-medium mb-2">{t('placeType')}</h3>
          <select
            value={filters.placeType}
            onChange={(e) => handleSelectChange('placeType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">{t('allTypes')}</option>
            {placeTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
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

        {/* Rating */}
        <div>
          <h3 className="font-medium mb-2">{t('minRating')}</h3>
          <select
            value={filters.minRating}
            onChange={(e) => handleSelectChange('minRating', Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value={0}>{t('anyRating')}</option>
            <option value={1}>1+ {t('stars')}</option>
            <option value={2}>2+ {t('stars')}</option>
            <option value={3}>3+ {t('stars')}</option>
            <option value={4}>4+ {t('stars')}</option>
            <option value={5}>5 {t('stars')}</option>
          </select>
        </div>

        {/* Featured Only */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.featuredOnly}
              onChange={() => handleBooleanChange('featuredOnly')}
              className="form-checkbox h-4 w-4 accent-petGreen"
            />
            <span className="text-sm font-medium">{t('featuredOnly')}</span>
          </label>
        </div>
      </div>
    </div>
  );
} 