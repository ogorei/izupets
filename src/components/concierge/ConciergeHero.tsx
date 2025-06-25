'use client';

import { useTranslations } from 'next-intl';

export default function ConciergeHero() {
  const t = useTranslations('Concierge');

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="w-full mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}
