import React from 'react';
import type { Criteria } from '../../../types';
import { useTranslations } from 'next-intl';

type Props = {
  criteria: Criteria;
};

export default function ProductCriteriaBar({ criteria }: Props) {
  const t = useTranslations('ProductCriteria');

  const basicProperties = [
    { key: 'fluidity', minCriteria: 'low', maxCriteria: 'high' },
    { key: 'transparency', minCriteria: 'opaque', maxCriteria: 'transparent' },
    { key: 'pH', minCriteria: 'acidic', maxCriteria: 'alkaline' },
    { key: 'waterMerge', minCriteria: 'repels', maxCriteria: 'blends easily' },
    { key: 'dispensingEase', minCriteria: 'difficult', maxCriteria: 'smooth' },
    { key: 'sizeOptions', minCriteria: 'few options', maxCriteria: 'many options' },
    { key: 'applicationTime', minCriteria: 'short', maxCriteria: 'long' },
    { key: 'instantEfficacyFeel', minCriteria: 'none', maxCriteria: 'strong' },
  ];

  const foamAndLather = [
    { key: 'latheringSpeed' },
    { key: 'foamSize' },
    { key: 'foamVolume' },
    { key: 'foamDensity' },
  ];

  const rinsingAndAfterFeel = [
    { key: 'rinsability' },
    { key: 'postWashFeel' },
  ];

  const makeupRemoverSpecific = [
    { key: 'makeupFluidity' },
    { key: 'spreadability' },
    { key: 'greasyTexture' },
    { key: 'applicationSmoothness' },
    { key: 'waterProofMascaraRemovability' },
    { key: 'filmTypeMascaraRemovability' },
    { key: 'liquidFoundationRemovability' },
    { key: 'lipRemovability' },
  ];


  return (
    <div className="w-full space-y-4">
      {basicProperties.map((item) => {
        const value = Number(criteria[item.key as keyof Criteria]) || 0;
        return (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="md:w-40 text-sm text-gray-600">{t(item.key)}</span>
              <div className="flex-1 relative">
                <div className="h-4 bg-gray-100 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${(value / 10) * 100}%`,
                      backgroundColor: '#7F434E'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t(item.minCriteria)}</span>
                  <span>{t(item.maxCriteria)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 