import { useTranslations } from 'next-intl';
import React from 'react';

interface TranslationWrapperProps {
  keys: string[];
  children: (translations: { [key: string]: string }) => React.ReactNode;
}

const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ keys, children }) => {
  const t = useTranslations();

  const translations = keys.reduce((acc, key) => {
    acc[key] = t(key);
    return acc;
  }, {} as { [key: string]: string });

  return <>{children(translations)}</>;
};

export default TranslationWrapper;
