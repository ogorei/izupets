import ProductCard from '../../../components/product/ProductCard';
import { fetchProducts } from "../../../../sanity/lib/fetch";
import { PetFriendlyLocation } from "../../../../types";

interface Props {
  params: { locale: string };
}

export default async function ProductsPage({ params }: Props) {
  const products: PetFriendlyLocation[] = await fetchProducts();
  if (products.length === 0) {
    return (
      // to change for bilingual phrase possible image
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No places available right now.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-7xl p-5 md:p-10 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <h1 className="text-2xl font-bold px-6 pt-6">RECOMMENDED FOR YOU</h1>
      {/* Scrollable vertical list of full-screen product sections */}
      <div className="lg:col-span-2">
        {products.map((p) => (
          <section
            key={p._id}
          >
            <ProductCard location={p} locale={params.locale as 'en' | 'ja'} />
          </section>
        ))}
      </div>
    </div>
  );
}
