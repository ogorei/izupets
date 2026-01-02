import HomeLayout from "@/components/home/HomeLayout";
import HeroSearch from "@/components/home/HeroSearch";
import { fetchEvents, fetchFeaturedPlaces } from "../../../sanity/lib/fetch";
import type { Event, PetFriendlyLocation } from "../../../types";
import Banner from "../../components/home/Banner";
import PostCard from "@/components/posts/PostCard";
import { getCategoriesByLocale } from "../../../src/utils/categories";
import Link from "next/link";
import NotFound from "./not-found";

type Locale = 'en' | 'ja';

interface Props {
  params: { locale: Locale };
}

// Helper function to convert Portable Text to plain text
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

export default async function LocalizedHomePage({ params }: Props) {
  const events = await fetchEvents();
  const categories = getCategoriesByLocale(params.locale);
  const featuredPlaces = await fetchFeaturedPlaces();
  const pageExists = true;

  console.log('Events fetched:', events.length);
  console.log('Events data:', JSON.stringify(events, null, 2));
  
  // Check each event structure
  events.forEach((event: Event, index: number) => {
    console.log(`Event ${index}:`, {
      id: event._id,
      title: event.title,
      slug: event.slug,
      hasImageURL: !!event.imageURL,
      hasDate: !!event.date,
      hasAuthorName: !!event.authorName
    });
  });

  if (!pageExists) {
    return <NotFound locale={params.locale} />;
  }

  const convertDate = (date: string) =>
    new Date(date).toISOString().slice(0, 10).replace(/-/g, "/");

  const sidebarContent = (
    <div className="space-y-6">
      {/* Featured Places Box */}
      <div className="p-4">
        <div className="flex items-center w-full mb-4">
          <h3 className="text-xl text-gray-500 whitespace-nowrap">FEATURED PLACES</h3>
          <div className="flex-1 h-0.5 bg-gray-100 ml-4"></div>
        </div>
        <nav className="mt-6">
          <ul className="space-y-3">
            {featuredPlaces.slice(0, 10).map((place: PetFriendlyLocation, index: number) => (
              <li key={place.slug.current} className="border hover:bg-gray-50 p-2 rounded transition">
                <Link
                  href={`/${params.locale}/places/${place.slug.current}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-accent transition duration-300"
                >
                  <span className="font-bold text-accent">{index + 1}.</span>
                  {place.imageURL && (
                    <img
                      src={place.imageURL}
                      alt={place.title[params.locale]}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="truncate text-sm block">{place.title[params.locale]}</span>
                    {place.placeType && (
                      <span className="text-xs text-gray-500 capitalize">{place.placeType}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Search Section */}
      <HeroSearch locale={params.locale} />
      
      {/* Main Content */}
      <HomeLayout sidebar={sidebarContent}>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event: Event) => {
            const description = event.description?.[params.locale];
            const plainTextDescription = description ? extractPlainText(description) : undefined;

            return (
              <PostCard
                key={event._id}
                id={event._id}
                slug={event.slug.current}
                title={event.title[params.locale]}
                description={plainTextDescription}
                date={event.date || event._createdAt}
                authorName={event.authorName}
                imageURL={event.imageURL}
                imageAlt={event.mainImage?.alt}
                locale={params.locale}
                convertDate={convertDate}
                spotType={event.spotType}
                tags={event.tags}
              />
            );
          })}
        </div>
      </HomeLayout>
    </>
  )
}