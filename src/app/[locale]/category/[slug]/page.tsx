import { fetchPostsByCategory } from "../../../../../sanity/lib/fetch";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import type { Article } from "../../../../../types";
import CategoryNotFound from "@/components/category/CategoryNotFound";

type Locale = 'en' | 'ja';

interface Props {
  params: { slug: string; locale: Locale };
}

export default async function CategoryPage({ params }: Props) {
  const posts = await fetchPostsByCategory(params.slug);

  if (!posts || posts.length === 0) return <CategoryNotFound />;

  // Get category name from the first post's category
  const categoryName = posts[0]?.category?.name;
  if (!categoryName) return <CategoryNotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-8 bg-[#7F434E]"></div>
        <h1 className="text-3xl font-bold flex items-center">
          <span className="text-sm font-thin tracking-wider text-gray-400 self-center mr-2">CATEGORY</span>
          {categoryName}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Article) => (
          <Link
            key={post._id}
            href={`/${params.locale}/posts/${post.slug.current}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
              {post.mainImage && (
                <div className="relative h-48">
                  <Image
                    src={post.imageURL}
                    alt={post.title[params.locale]}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-red-700">
                  {post.title[params.locale]}
                </h2>
                <p className="text-gray-600 text-sm">
                  {new Date(post._createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

