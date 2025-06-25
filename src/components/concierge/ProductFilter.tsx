'use client';

import { useState } from 'react';
import { Product } from '../../../types';
import { useTranslations } from 'next-intl';

type Locale = 'en' | 'ja';

interface FilterState {
  applicationSmoothness: number;
  latheringSpeed: number;
  postWashFeel: number;
  alcoholFree: boolean;
  parabenFree: boolean;
  sulfateFree: boolean;
  fragranceFree: boolean;
  suitableForNormalSkin: boolean;
  suitableForDrySkin: boolean;
  suitableForOilySkin: boolean;
  suitableForCombinationSkin: boolean;
  suitableForSensitiveSkin: boolean;
}

interface Props {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
  locale: Locale;
}

export default function ProductFilter({ products, onFilterChange, locale }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    applicationSmoothness: 0,
    latheringSpeed: 0,
    postWashFeel: 0,
    alcoholFree: false,
    parabenFree: false,
    sulfateFree: false,
    fragranceFree: false,
    suitableForNormalSkin: false,
    suitableForDrySkin: false,
    suitableForOilySkin: false,
    suitableForCombinationSkin: false,
    suitableForSensitiveSkin: false,
  });

  const t = useTranslations('ProductFilter');

  const handleNumericChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: parseInt(value) };
    setFilters(newFilters);
    filterProducts(newFilters);
  };

  const handleBooleanChange = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    filterProducts(newFilters);
  };

  const filterProducts = (currentFilters: FilterState) => {
    const filteredProducts = products.filter((product) => {
      const criteria = product.criteria;
      if (!criteria) return false;

      // Check numeric criteria
      if (
        criteria.applicationSmoothness &&
        criteria.applicationSmoothness < currentFilters.applicationSmoothness
      )
        return false;
      if (
        criteria.latheringSpeed &&
        criteria.latheringSpeed < currentFilters.latheringSpeed
      )
        return false;
      if (
        criteria.postWashFeel &&
        criteria.postWashFeel < currentFilters.postWashFeel
      )
        return false;

      // Check boolean criteria
      if (currentFilters.alcoholFree && !criteria.alcoholFree) return false;
      if (currentFilters.parabenFree && !criteria.parabenFree) return false;
      if (currentFilters.sulfateFree && !criteria.sulfateFree) return false;
      if (currentFilters.fragranceFree && !criteria.fragranceFree) return false;

      // Check skin type criteria
      if (
        currentFilters.suitableForNormalSkin &&
        !criteria.suitableForNormalSkin
      )
        return false;
      if (currentFilters.suitableForDrySkin && !criteria.suitableForDrySkin)
        return false;
      if (currentFilters.suitableForOilySkin && !criteria.suitableForOilySkin)
        return false;
      if (
        currentFilters.suitableForCombinationSkin &&
        !criteria.suitableForCombinationSkin
      )
        return false;
      if (
        currentFilters.suitableForSensitiveSkin &&
        !criteria.suitableForSensitiveSkin
      )
        return false;

      return true;
    });

    onFilterChange(filteredProducts);
  };

  return (
    <div className="bg-gray-100 p-6 shadow-md sticky top-8">
      <h2 className="text-lg md:text-2xl font-semibold mb-4">{t('title')}</h2>
      <div className="space-y-6">
        {/* Numeric Criteria */}
        <div>
          <h3 className="font-medium mb-2">{t('applicationProperties')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                {t('applicationSmoothness')}
              </label>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={filters.applicationSmoothness}
                    onChange={(e) =>
                      handleNumericChange('applicationSmoothness', e.target.value)
                    }
                    className="w-full h-8 accent-[#7F434E] [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-none [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-none"
                  />
                  <div className="flex justify-between px-1">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <span key={num} className="text-xs text-gray-600">{num}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">
                {t('latheringSpeed')}
              </label>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={filters.latheringSpeed}
                    onChange={(e) =>
                      handleNumericChange('latheringSpeed', e.target.value)
                    }
                    className="w-full h-8 accent-[#7F434E] [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-none [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-none"
                  />
                  <div className="flex justify-between px-1">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <span key={num} className="text-xs text-gray-600">{num}</span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">
                {t('postWashFeel')}
              </label>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={filters.postWashFeel}
                    onChange={(e) =>
                      handleNumericChange('postWashFeel', e.target.value)
                    }
                    className="w-full h-8 accent-[#7F434E] [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-none [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-none"
                  />
                  <div className="flex justify-between px-1">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <span key={num} className="text-xs text-gray-600">{num}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boolean Criteria */}
        <div>
          <h3 className="font-medium mb-2">{t('productProperties')}</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.alcoholFree}
                onChange={() => handleBooleanChange('alcoholFree')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('alcoholFree')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.parabenFree}
                onChange={() => handleBooleanChange('parabenFree')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('parabenFree')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.sulfateFree}
                onChange={() => handleBooleanChange('sulfateFree')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('sulfateFree')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.fragranceFree}
                onChange={() => handleBooleanChange('fragranceFree')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('fragranceFree')}</span>
            </label>
          </div>
        </div>

        {/* Skin Type Criteria */}
        <div>
          <h3 className="font-medium mb-2">{t('skinType')}</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.suitableForNormalSkin}
                onChange={() => handleBooleanChange('suitableForNormalSkin')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('normalSkin')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.suitableForDrySkin}
                onChange={() => handleBooleanChange('suitableForDrySkin')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('drySkin')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.suitableForOilySkin}
                onChange={() => handleBooleanChange('suitableForOilySkin')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('oilySkin')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.suitableForCombinationSkin}
                onChange={() => handleBooleanChange('suitableForCombinationSkin')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('combinationSkin')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.suitableForSensitiveSkin}
                onChange={() => handleBooleanChange('suitableForSensitiveSkin')}
                className="form-checkbox h-4 w-4 accent-[#7F434E]"
              />
              <span className="text-sm">{t('sensitiveSkin')}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 