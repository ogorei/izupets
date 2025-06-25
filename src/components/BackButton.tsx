'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function BackButton() {
  const router = useRouter();
  const t = useTranslations('Common');

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-[#6B7280] hover:text-[#7F434E] transition-colors mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      {t('back')}
    </button>
  );
} 