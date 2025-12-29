'use client';

import { createNavigation } from 'next-intl/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Globe, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const locales = ['en', 'ja'] as const;  // Define the supported locales
const { Link, useRouter: useIntlRouter, usePathname } = createNavigation({ locales });

export default function LocaleSwitcher() {
  const intlRouter = useIntlRouter();
  const nextRouter = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>('');

  // Get current locale from pathname
  useEffect(() => {
    const locale = pathname.split('/')[1];
    if (locales.includes(locale as any)) {
      setCurrentLocale(locale);
    }
  }, [pathname]);

  const handleLocaleChange = async (locale: string) => {
    if (locale === currentLocale || isLoading) return;
    
    setIsLoading(true);
    try {
      // Use the intl router for proper locale navigation
      await intlRouter.push(pathname, { locale });
    } catch (error) {
      console.error('Error changing locale:', error);
      setIsLoading(false);
    }
  };

  // Reset loading state when pathname changes (navigation completes)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center px-3 py-2 text-accent">
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Globe className="w-5 h-5 mr-2" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] bg-white border border-gray-200 rounded-md shadow-md"
        >
          {locales.map((locale) => (
            <DropdownMenu.Item
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              disabled={isLoading}
              className={`cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-white ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${locale === currentLocale ? 'bg-accent text-white' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  {locale.toUpperCase()}
                </div>
              ) : (
                locale.toUpperCase()
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
