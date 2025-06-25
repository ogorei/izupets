'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
        <button
          onClick={() => reset()}
          className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90 transition"
        >
          {t('tryAgain')}
        </button>
      </div>
    </div>
  );
}