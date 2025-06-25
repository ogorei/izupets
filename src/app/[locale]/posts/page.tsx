import { fetchPost } from "../../../../sanity/lib/fetch";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "../../../../types";

type Locale = 'en' | 'ja';

interface Props {
  params: { locale: Locale };
}

export default async function PostsPage({ params }: Props) {
  const posts = await fetchPost();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Posts</h1>
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
