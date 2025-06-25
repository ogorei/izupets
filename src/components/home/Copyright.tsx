import { useTranslations } from 'next-intl';

export default function Copyright() {
  const t = useTranslations('copyright');
  return (
    <div className="bg-accent text-white p-4 text-center">
      <p>{t('copyright')}</p>
    </div>
  );
}