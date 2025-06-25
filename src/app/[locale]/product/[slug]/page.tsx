import ProductCard from '../../../../components/product/ProductCard';
import { fetchProducts } from "../../../../../sanity/lib/fetch";
import { Product } from "../../../../../types";
import { notFound } from 'next/navigation';
import BackButton from "@/components/BackButton";

interface Props {
  params: {
    slug: string;
    locale: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const products: Product[] = await fetchProducts();
  const product = products.find(p => p.slug.current === params.slug);

  console.log("locale params",params);
  

  if (!product) {
    return notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <BackButton />
      <ProductCard product={product} locale={params.locale as 'en' | 'ja'} />
    </div>
  );
}
