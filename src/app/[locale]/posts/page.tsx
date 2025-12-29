import { fetchPost, testFetch } from "../../../../sanity/lib/fetch";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "../../../../types";
import { Suspense } from "react";

type Locale = 'en' | 'ja';

interface Props {
  params: { locale: Locale };
}

// Loading skeleton component
function PostsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main posts content component
async function PostsContent({ params }: Props) {
  let posts;
  let testData;
  let error: Error | null = null;
  
  try {
    // Try test query first
    testData = await testFetch();
    // Then try main query
    posts = await fetchPost();
    console.log('Posts data:', posts);
    console.log('Current locale:', params.locale);
    console.log('Posts length:', posts?.length);
  } catch (err) {
    console.error('Error fetching posts:', err);
    error = err instanceof Error ? err : new Error('Unknown error occurred');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Posts</h1>
      
      {/* Debug info */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>Debug: Found {posts?.length || 0} posts</p>
        <p>Current locale: {params.locale}</p>
        <p>Test data length: {testData?.length || 0}</p>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        <p>Posts data: {JSON.stringify(posts, null, 2)}</p>
      </div> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts && posts.length > 0 ? (
          posts.map((post: Event) => (
            <Link
              key={post._id}
              href={`/${params.locale}/posts/${post.slug.current}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                {post.mainImage && (
                  <div className="relative h-48">
                    <Image
                      src={post.imageURL || ''}
                      alt={post.title[params.locale] || post.title.ja || post.title.en || 'Post image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-red-700">
                    {post.title[params.locale] || post.title.ja || post.title.en || 'Untitled'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {post.date ? new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) : new Date(post._createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {post.authorName && (
                    <p className="text-gray-500 text-xs mt-1">
                      By {post.authorName}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No posts found</p>
            {error && <p className="text-red-500 mt-2">Error loading posts: {error.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostsPage({ params }: Props) {
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <PostsContent key={params.locale} params={params} />
    </Suspense>
  );
}
