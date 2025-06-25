'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface BreadcrumbItem {
  breadcrumb: string;
  href: string;
}

const convertBreadcrumb = (string: string): string => {
  return string
    .replace(/-/g, ' ')
    .replace(/oe/g, 'ö')
    .replace(/ae/g, 'ä')
    .replace(/ue/g, 'ü')
    .toUpperCase();
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[] | null>(null);

  useEffect(() => {
    if (pathname) {
      const linkPath = pathname.split('/').filter(Boolean);
      const pathArray: BreadcrumbItem[] = linkPath.map((path, i) => ({
        breadcrumb: path,
        href: '/' + linkPath.slice(0, i + 1).join('/'),
      }));
      setBreadcrumbs(pathArray);
    }
  }, [pathname]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav aria-label="breadcrumbs" className="py-2 px-4">
      <ol className="flex space-x-2 text-sm text-fifth">
        <li>
          <Link href="/" className=" hover:underline font-semibold">
            HOME
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, i) => (
          <li key={breadcrumb.href} className="flex items-center space-x-2">
            <span className="text-secondary">/</span>
            <Link
              href={breadcrumb.href}
              className={`hover:underline ${
                i === breadcrumbs.length - 1 ? 'text-secondary font-bold' : 'text-red'
              }`}
            >
              {convertBreadcrumb(breadcrumb.breadcrumb)}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
