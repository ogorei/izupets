import { fetchPost, testFetch, fetchAllCategories } from "../../../../sanity/lib/fetch";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "../../../../types";
import type { Category } from "../../../../src/types";
import { Suspense } from "react";
import HomeLayout from "@/components/home/HomeLayout";
import { iconMap } from "@/utils/iconMap";

type Locale = 'en' | 'ja';

interface Props {
  params: { locale: Locale };
}

// Loading skeleton component
function PostsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
      <div className="space-y-6 px-4 md:px-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-[40%] h-48 md:h-auto bg-gray-200 animate-pulse"></div>
            <div className="flex-1 md:w-[60%] p-6">
              <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
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
  let categories: Category[] = [];
  
  try {
    categories = await fetchAllCategories();
    console.log('Categories fetched:', categories?.length || 0);
    console.log('Categories data:', JSON.stringify(categories, null, 2));
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
  
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

  const sidebarContent = (
    <div className="space-y-6">
      {/* Categories Box */}
      <div className="p-4">
        <div className="flex items-center w-full mb-4">
          <h3 className="text-xl text-gray-500 whitespace-nowrap">CATEGORIES</h3>
          <div className="flex-1 h-0.5 bg-gray-100 ml-4"></div>
        </div>
        <nav className="mt-6">
          <ul className="flex flex-col gap-2">
            {categories && categories.length > 0 ? (
              categories.map((category: Category) => {
                const IconComponent = iconMap[category?.icon as keyof typeof iconMap];
                return (
                  <li key={category.slug?.current || category._id} className="border hover:bg-categories border-categories flex items-center gap-2 p-2 transition">
                    <Link
                      href={`/${params.locale}/category/${category.slug?.current}`}
                      className="flex items-center gap-2 text-gray-500 hover:text-accent transition duration-300 w-full"
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                      <span className="text-sm sm:text-base">
                        {category.name?.[params.locale as 'en' | 'ja']}
                      </span>
                    </Link>
                  </li>
                );
              })
            ) : (
              <li className="text-sm text-gray-500 p-2">No categories available</li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );

  // Helper function to extract plain text from description
  const extractPlainText = (description: any): string => {
    if (!description) return '';
    if (typeof description === 'string') return description;
    if (Array.isArray(description)) {
      return description
        .map((block: any) => {
          if (block && block._type === 'block' && block.children) {
            return block.children
              .map((child: any) => child && child.text ? child.text : '')
              .join('');
          }
          return '';
        })
        .join(' ');
    }
    return '';
  };

  return (
    <HomeLayout sidebar={sidebarContent}>
      <h1 className="text-3xl font-bold mb-8">All Posts</h1>
      
      {/* Debug info */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>Debug: Found {posts?.length || 0} posts</p>
        <p>Current locale: {params.locale}</p>
        <p>Test data length: {testData?.length || 0}</p>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        <p>Posts data: {JSON.stringify(posts, null, 2)}</p>
      </div> */}
      
      <div className="space-y-6 px-4 md:px-0">
        {posts && posts.length > 0 ? (
          posts.map((post: Event) => {
            const description = post.description?.[params.locale];
            const plainTextDescription = description ? extractPlainText(description) : '';
            const trimmedDescription = plainTextDescription.length > 200 
              ? plainTextDescription.slice(0, 200) + '...' 
              : plainTextDescription;

            return (
              <Link
                key={post._id}
                href={`/${params.locale}/posts/${post.slug.current}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row">
                  {/* Image on left (mobile: top) - 40% width */}
                  {post.mainImage && post.imageURL && (
                    <div className="relative w-full md:w-[40%] h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={post.imageURL}
                        alt={post.title[params.locale] || post.title.ja || post.title.en || 'Post image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content on right (mobile: bottom) - 60% width */}
                  <div className="flex-1 md:w-[60%] p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-red-700 transition-colors">
                        {post.title[params.locale] || post.title.ja || post.title.en || 'Untitled'}
                      </h2>
                      {trimmedDescription && (
                        <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-4">
                          {trimmedDescription}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <p>
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
                          <>
                            <span>・</span>
                            <p>By {post.authorName}</p>
                          </>
                        )}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts found</p>
            {error && <p className="text-red-500 mt-2">Error loading posts: {error.message}</p>}
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default function PostsPage({ params }: Props) {
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <PostsContent key={params.locale} params={params} />
    </Suspense>
  );
}
