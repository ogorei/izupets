'use client';

import { useTranslations } from 'next-intl';
import { Search } from "lucide-react";

export default function CategoryNotFound() {
  const t = useTranslations('Category');

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 md:px-0">
      <div className="w-full max-w-md text-center">
        <Search className="w-20 h-20 text-[#7F434E] mx-auto mb-4" />
        <h1 className="text-2xl md:text-xl font-bold text-[#7F434E] mb-2">
          {t('notFound.title')}
        </h1>
        <p className="text-gray-600">
          {t('notFound.description')}
        </p>
      </div>
    </div>
  );
} 