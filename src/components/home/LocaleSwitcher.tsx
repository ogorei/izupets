'use client';

import { createNavigation } from 'next-intl/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Globe } from 'lucide-react';

const locales = ['en', 'ja'] as const;  // Define the supported locales
const { Link, useRouter, usePathname } = createNavigation({ locales });

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
      <button className="flex items-center px-3 py-2 text-accent ">
          <Globe className="w-5 h-5 mr-2" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] bg-white border border-gray-200 rounded-md shadow-md"
        >
          {locales.map((locale) => (
            <DropdownMenu.Item
              key={locale}
              onClick={() => router.push(pathname, { locale })}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-white"
            >
              {locale.toUpperCase()}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
