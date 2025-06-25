import { useTranslations } from 'next-intl';
import { PortableText } from '@portabletext/react';
import { iconMap } from "@/utils/iconMap";
import type { PetActivityType, PetFriendlySpot } from '../../../types';
import Link from 'next/link';
import { translateCategory } from "@/utils/category";

type Locale = 'en' | 'ja';

interface BannerProps {
  post: PetFriendlySpot;
  locale: Locale;
  categories: PetActivityType[];
}

export default function Banner({ post, locale, categories }: BannerProps) {
  const t = useTranslations('Banner');
  return (
    <div className="flex flex-col mb-10 items-center text-center lg:items-start lg:text-left">
      {/* Responsive Image */}
      <div className="w-full max-w-3xl">
        <img
          src={post.imageURL}
          alt={post.mainImage?.alt || post.title[locale]}
          className="w-full h-auto shadow-md rounded-lg"
        />
      </div>

      {/* Title, Subtitle, and Button */}
      <div className="mt-4 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-petBrown-dark">{post.title[locale]}</h2>
        {post.description && (
          <div className="mt-2 text-md text-gray-600">
            <PortableText value={post.description[locale]} />
          </div>
        )}

        {/* Read More Button */}
        <a
          href={`/${locale}/posts/${post.slug.current}`}
          className="mt-4 inline-block px-4 py-2 bg-petGreen text-white shadow hover:bg-petGreen-dark transition duration-300 rounded-lg"
        >
          {t('readMore')}
        </a>

        {/* Mobile Categories */}
        <div className="mt-8 lg:hidden">
          <div className="flex items-center w-full mb-4">
            <h3 className="text-xl text-petBrown-dark whitespace-nowrap">PET ACTIVITIES</h3>
            <div className="flex-1 h-0.5 bg-petBrown-light ml-4"></div>
          </div>
          <nav className="mt-6">
            <ul className="grid grid-cols-2 gap-2 auto-rows-min">
              {categories.map((category: PetActivityType) => {
                const IconComponent = iconMap[category?.icon as keyof typeof iconMap];
                return (
                  <li key={category.slug.current} className="border hover:bg-petGreen-light border-petGreen flex items-center justify-center gap-2 p-2 transition rounded-lg">
                    <Link
                      href={`/${locale}/category/${category.slug.current}`}
                      className="flex items-center gap-2 text-petBrown-dark hover:text-petGreen-dark transition duration-300 w-auto min-w-0"
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                      <span className="truncate text-sm sm:text-base text-center">
                        {category.name[locale]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}