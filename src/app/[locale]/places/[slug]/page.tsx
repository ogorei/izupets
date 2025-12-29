import ProductCard from '../../../../components/product/ProductCard';
import { fetchPlaceBySlug } from "../../../../../sanity/lib/fetch";
import { PetFriendlyLocation } from "../../../../../types";
import { notFound } from 'next/navigation';
import BackButton from "@/components/BackButton";

interface Props {
  params: {
    slug: string;
    locale: string;
  };
}

export default async function PlacesPage ({ params }: Props) {
  const places: PetFriendlyLocation = await fetchPlaceBySlug(params.slug);

  console.log("locale params", params);
  console.log("places data", places);

  if (!places) {
    return notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <BackButton />
      <ProductCard location={places} locale={params.locale as 'en' | 'ja'} />
    </div>
  );
}
