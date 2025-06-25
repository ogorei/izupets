'use client';

import React from 'react';
import Image from 'next/image';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PetFriendlyLocation } from '../../../types';
import { urlFor } from '../../../sanity/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Star, MapPin, Phone, Globe, Clock, PawPrint } from 'lucide-react';

type Locale = 'en' | 'ja';

type Props = {
  location: PetFriendlyLocation;
  minimal?: boolean;
  locale: Locale;
};

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-2">{children}</p>,
    h2: ({ children }) => <h2 className="text-xl font-semibold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-petBlue hover:underline"
      >
        {children}
      </a>
    ),
  },
};

// Helper function to trim text and add ellipsis
const trimText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Helper function to extract plain text from Portable Text
const extractPlainText = (blocks: any[]): string => {
  if (!blocks) return '';
  return blocks
    .map(block => {
      if (block._type === 'block') {
        return block.children
          .map((child: any) => child.text)
          .join('');
      }
      return '';
    })
    .join(' ');
};

// Helper function to render rating stars
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < rating ? 'text-petYellow fill-current' : 'text-gray-300'
      }`}
    />
  ));
};

export default function PetFriendlyLocationCard({ location, minimal = false, locale }: Props) {
  const t = useTranslations('ProductCard');
  const imgUrl = location.mainImage
    ? urlFor(location.mainImage).url()
    : '/placeholder.png';

  if (minimal) {
    const description = location.description ? extractPlainText(location.description[locale]) : '';
    const trimmedDescription = trimText(description, 100);

    return (
      <div className="flex flex-col w-full bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-lg">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imgUrl}
            alt={location.name[locale] ?? t('unnamedProduct')}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-petBrown-dark mb-2">
            {location.name[locale] ?? t('untitled')}
          </h3>
          {location.type && (
            <p className="text-sm text-petGreen-dark mb-2">
              {t('type')}: {location.type.name?.[locale]}
            </p>
          )}
          <p className="text-sm text-gray-600 line-clamp-2">
            {trimmedDescription || t('noDescription')}
          </p>
          <Link
            href={`/${locale}/product/${location.slug.current}`}
            className="inline-block mt-3 text-sm text-petGreen hover:underline"
          >
            {t('more')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-8 mx-auto bg-white shadow-md md:p-6 rounded-lg">
      {/* Left Column - Image and Description */}
      <div className="flex-1 space-y-6">
        {/* Location Image & Title */}
        <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-lg">
          <Image
            src={imgUrl}
            alt={location.name[locale] ?? t('unnamedProduct')}
            fill
            className="object-cover"
            priority
          />
          <h2 className="absolute bottom-2 left-2 md:text-lg font-bold bg-white/90 px-2 py-1 rounded">
            {location.name[locale] ?? t('untitled')}
          </h2>
        </div>

        {/* Type & Category */}
        <div className="text-sm text-gray-600 space-x-2">
          {location.type && (
            <span>
              {t('type')}: <span className="font-medium text-petGreen-dark">{location.type.name?.[locale]}</span>
            </span>
          )}
          {location.category?.name && (
            <>
              <span>|</span>
              <span>
                {t('category')}:{' '}
                <span className="font-medium text-petBrown-dark">{location.category.name[locale]}</span>
              </span>
            </>
          )}
        </div>

        {/* Rating */}
        {location.rating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('overallRating')}:</span>
            <div className="flex">{renderStars(location.rating)}</div>
            <span className="text-sm text-gray-500">({location.rating}/5)</span>
          </div>
        )}

        {/* Location Description */}
        <div className="prose prose-sm max-w-none">
          {location.description ? (
            <PortableText value={location.description[locale]} components={ptComponents} />
          ) : (
            <p className="text-gray-500 italic">{t('noDescription')}</p>
          )}
        </div>
      </div>

      {/* Right Column - Location Information */}
      <div className="flex-1 space-y-6">
        {/* Location Details */}
        <div className="w-full bg-petGreen-light/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-petBrown-dark">{t('locationInfo')}</h3>
          
          {/* Address */}
          {location.address && (
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-petGreen mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('address')}:</span>
                <p className="text-sm text-gray-600">{location.address[locale]}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {location.phoneNumber && (
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-petGreen" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('phone')}:</span>
                <a href={`tel:${location.phoneNumber}`} className="text-sm text-petBlue hover:underline">
                  {location.phoneNumber}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {location.website && (
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-petGreen" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('website')}:</span>
                <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-sm text-petBlue hover:underline">
                  Visit Website
                </a>
              </div>
            </div>
          )}

          {/* Hours */}
          {location.hours && (
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-petGreen" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('hours')}:</span>
                <p className="text-sm text-gray-600">{location.hours[locale]}</p>
              </div>
            </div>
          )}
        </div>

        {/* Pet Information */}
        <div className="w-full bg-petBrown-light/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-petBrown-dark flex items-center gap-2">
            <PawPrint className="w-5 h-5" />
            {t('features')}
          </h3>
          
          {/* Pet Fees */}
          {location.petFees && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('petFees')}:</span>
              <p className="text-sm text-gray-600">{location.petFees[locale]}</p>
            </div>
          )}

          {/* Pet Restrictions */}
          {location.petSizeRestrictions && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('petRestrictions')}:</span>
              <p className="text-sm text-gray-600">{location.petSizeRestrictions[locale]}</p>
            </div>
          )}

          {/* Pet Features */}
          {location.petFriendlyFeatures && location.petFriendlyFeatures[locale].length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">{t('features')}:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {location.petFriendlyFeatures[locale].map((feature, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-petGreen text-white rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
