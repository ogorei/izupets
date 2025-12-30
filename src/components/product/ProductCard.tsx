'use client';

import React from 'react';
import Image from 'next/image';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PetFriendlyLocation } from '../../../types';
import { urlFor } from '../../../sanity/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Star, MapPin, Phone, Globe, Clock, PawPrint, Mail, DollarSign, Tag, Calendar } from 'lucide-react';

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
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map(block => {
      if (block && block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child && child.text ? child.text : '')
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

// Helper function to format address
const formatAddress = (address: any, locale: string = 'en') => {
  if (!address) return '';
  
  // New structure: address has 'en' and 'ja' fields
  if (address[locale]) {
    return address[locale];
  }
  
  // Fallback to English if the requested locale is not available
  if (address.en) {
    return address.en;
  }
  
  // Legacy structure fallback (for backward compatibility)
  if (address.street || address.city || address.state || address.country) {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  }
  
  return '';
};

// Helper function to format hours
const formatHours = (hours: any) => {
  if (!hours) return '';
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const formattedDays = days.map((day, index) => {
    if (hours[day]) {
      return `${dayNames[index]}: ${hours[day]}`;
    }
    return null;
  }).filter(Boolean);

  if (hours.notes) {
    formattedDays.push(hours.notes);
  }

  return formattedDays.join('\n');
};

export default function PetFriendlyLocationCard({ location, minimal = false, locale }: Props) {
  const t = useTranslations('ProductCard');
  
  // Get image from restaurantDetails if it's a restaurant, otherwise use top-level or fallback
  const isRestaurant = location.categorySlug === 'restaurant' || location.placeType === 'restaurant';
  const mainImage = isRestaurant && location.restaurantDetails?.mainImage 
    ? location.restaurantDetails.mainImage 
    : location.mainImage;
  
  // Prioritize imageURL from query (which handles restaurantDetails.mainImage), then urlFor, then fallback
  const imgUrl = location.imageURL 
    ? location.imageURL
    : mainImage && mainImage.asset
      ? urlFor(mainImage).url()
      : '/placeholder.png';

  // Get description from restaurantDetails if it's a restaurant
  const description = isRestaurant && location.restaurantDetails?.description
    ? location.restaurantDetails.description
    : location.description && location.description[locale] 
      ? extractPlainText(location.description[locale]) 
      : '';

  if (minimal) {
    const trimmedDescription = trimText(description, 100);

    return (
      <div className="flex flex-col h-full w-full bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-lg">
        <div className="relative w-full h-48 sm:h-56 md:h-48 overflow-hidden flex-shrink-0">
          <Image
            src={imgUrl}
            alt={location.title?.[locale] ?? t('unnamedProduct')}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-bold text-petBrown-dark mb-2 line-clamp-2">
            {location.title?.[locale] ?? t('untitled')}
          </h3>
          {location.placeType && (
            <p className="text-sm text-petGreen-dark mb-2 flex-shrink-0">
              {t('type')}: {location.placeType}
            </p>
          )}
          <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
            {trimmedDescription || t('noDescription')}
          </p>
          <Link
            href={`/${locale}/places/${location.slug.current}`}
            className="inline-block mt-3 text-sm text-petGreen hover:underline flex-shrink-0"
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
            alt={location.title?.[locale] ?? t('unnamedProduct')}
            fill
            className="object-cover"
            priority
          />
          <h2 className="absolute bottom-2 left-2 md:text-lg font-bold bg-white/90 px-2 py-1 rounded">
            {location.title?.[locale] ?? t('untitled')}
          </h2>
        </div>

        {/* Type & Category */}
        <div className="text-sm text-gray-600 space-x-2">
          {location.placeType && (
            <span>
              {t('type')}: <span className="font-medium text-petGreen-dark">{location.placeType}</span>
            </span>
          )}
        </div>

        {/* Rating - from restaurantDetails for restaurants */}
        {(isRestaurant ? location.restaurantDetails?.rating : location.rating) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('overallRating')}:</span>
            <div className="flex">{renderStars(isRestaurant ? location.restaurantDetails!.rating! : location.rating!)}</div>
            <span className="text-sm text-gray-500">({isRestaurant ? location.restaurantDetails!.rating! : location.rating!}/5)</span>
          </div>
        )}

        {/* Price Range - from restaurantDetails for restaurants */}
        {(isRestaurant ? location.restaurantDetails?.priceRange : location.priceRange) && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-petGreen" />
            <span className="text-sm text-gray-600">
              {t('priceRange')}: <span className="font-medium">{isRestaurant ? location.restaurantDetails!.priceRange! : location.priceRange!}</span>
            </span>
          </div>
        )}

        {/* Restaurant-specific fields */}
        {isRestaurant && location.restaurantDetails && (
          <div className="space-y-2">
            {location.restaurantDetails.name && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">{t('name') || 'Name'}:</span>
                <span className="text-gray-600 ml-2">{location.restaurantDetails.name}</span>
              </div>
            )}
            {location.restaurantDetails.location && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">{t('location') || 'Location'}:</span>
                <span className="text-gray-600 ml-2">{location.restaurantDetails.location}</span>
              </div>
            )}
            {location.restaurantDetails.genre && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">{t('genre') || 'Genre'}:</span>
                <span className="text-gray-600 ml-2">{location.restaurantDetails.genre}</span>
              </div>
            )}
          </div>
        )}

        {/* Location Description */}
        <div className="prose prose-sm max-w-none">
          {isRestaurant && location.restaurantDetails?.description ? (
            <p className="text-gray-600">{location.restaurantDetails.description}</p>
          ) : location.description && location.description[locale] ? (
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
                <p className="text-sm text-gray-600">{formatAddress(location.address, locale)}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {location.contact?.phone && (
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-petGreen" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('phone')}:</span>
                <a href={`tel:${location.contact.phone}`} className="text-sm text-petBlue hover:underline">
                  {location.contact.phone}
                </a>
              </div>
            </div>
          )}

          {/* Email */}
          {location.contact?.email && (
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-petGreen" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('email')}:</span>
                <a href={`mailto:${location.contact.email}`} className="text-sm text-petBlue hover:underline">
                  {location.contact.email}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {location.contact?.website && (
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-petGreen" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('website')}:</span>
                <a href={location.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm text-petBlue hover:underline">
                  Visit Website
                </a>
              </div>
            </div>
          )}

          {/* Hours */}
          {location.hours && (
            <div className="flex items-start gap-2 mb-3">
              <Clock className="w-4 h-4 text-petGreen mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('hours')}:</span>
                <pre className="text-sm text-gray-600 whitespace-pre-line font-sans">{formatHours(location.hours)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Pet Information */}
        <div className="w-full bg-petBrown-light/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-petBrown-dark flex items-center gap-2">
            <PawPrint className="w-5 h-5" />
            {t('petFeatures')}
          </h3>
          
          {/* Pet Allowed Types */}
          {location.petFriendlyFeatures && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('petsAllowed')}:</span>
              <div className="flex gap-2 mt-1">
                {location.petFriendlyFeatures.dogsAllowed && (
                  <span className="inline-block px-2 py-1 text-xs bg-petGreen text-white rounded-full">Dogs</span>
                )}
                {location.petFriendlyFeatures.catsAllowed && (
                  <span className="inline-block px-2 py-1 text-xs bg-petGreen text-white rounded-full">Cats</span>
                )}
                {location.petFriendlyFeatures.otherPetsAllowed && (
                  <span className="inline-block px-2 py-1 text-xs bg-petGreen text-white rounded-full">Other Pets</span>
                )}
              </div>
            </div>
          )}

          {/* Pet Fees */}
          {location.petFriendlyFeatures?.petFees && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('petFees')}:</span>
              <p className="text-sm text-gray-600">{location.petFriendlyFeatures.petFees}</p>
            </div>
          )}

          {/* Size Restrictions */}
          {location.petFriendlyFeatures?.sizeRestrictions && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('sizeRestrictions')}:</span>
              <p className="text-sm text-gray-600">{location.petFriendlyFeatures.sizeRestrictions}</p>
            </div>
          )}

          {/* Pet Amenities */}
          {location.petFriendlyFeatures?.petAmenities && location.petFriendlyFeatures.petAmenities.length > 0 && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('petAmenities')}:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {location.petFriendlyFeatures.petAmenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-petBlue text-white rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pet Rules */}
          {location.petFriendlyFeatures?.petRules && location.petFriendlyFeatures.petRules.length > 0 && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('petRules')}:</span>
              <ul className="list-disc pl-5 mt-1">
                {location.petFriendlyFeatures.petRules.map((rule, index) => (
                  <li key={index} className="text-sm text-gray-600">{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="w-full bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-petBrown-dark flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t('additionalInfo')}
          </h3>
          
          {/* Featured Status */}
          {location.featured && (
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs bg-petYellow text-petBrown-dark rounded-full font-medium">
                Featured Place
              </span>
            </div>
          )}

          {/* Published Date */}
          {location.publishedAt && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('publishedAt')}:</span>
              <p className="text-sm text-gray-600">
                {new Date(location.publishedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Last Updated */}
          {location.lastUpdated && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">{t('lastUpdated')}:</span>
              <p className="text-sm text-gray-600">
                {new Date(location.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
