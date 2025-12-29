import type { Event } from "../../../../../types";
import { fetchPostByRanking, fetchPostBySlug, debugRanking } from "../../../../../sanity/lib/fetch";
import { urlFor } from '../../../../../sanity/lib/utils';
import { notFound } from "next/navigation";
import Image from "next/image";
import PostLayout from "@/components/posts/PostLayout";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import type { PortableTextComponents } from '@portabletext/react';
import BackButton from "@/components/BackButton";
import { Suspense } from "react";

type Locale = "en" | "ja";
interface Props {
  params: { slug: string; locale: Locale };
}

const convertDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const PortableTextComponent: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;

      // Fallback if no alt text
      const alt = value.alt || 'Embedded blog image';

      // If you're using @sanity/image-url, generate image URL dynamically
      // If not, you can access value.asset.url if your GROQ query includes it
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={alt}
            width={800}
            height={500}
            className="w-full object-cover rounded-md"
          />
          {value.caption && (
            <p className="text-center text-sm text-gray-500 mt-2">{value.caption}</p>
          )}
        </div>
      );
    }
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-xl md:text-4xl font-bold pt-2 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl md:text-3xl font-semibold pt-2 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="flex items-center bg-gray-100 py-2 my-4 px-4 border-l-4 border-red-700 font-bold text-black text-lg">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-relaxed mb-2">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
  },
};

// Loading skeleton for single post
function PostDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
      <div className="w-full h-[40vh] bg-gray-200 animate-pulse mb-8"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

// Main post detail content
async function PostDetailContent({ params }: Props) {
  const [post, rankedPosts, debugData] = await Promise.all([
    fetchPostBySlug(params.slug),
    fetchPostByRanking(),
    debugRanking(),
  ]) as [Event | null, Event[], any[]];

  // Debug logging
  console.log('Ranked posts data:', rankedPosts);
  console.log('Ranked posts length:', rankedPosts?.length);
  console.log('Ranked posts with ranking:', rankedPosts?.filter(p => p.ranking));
  console.log('Debug ranking data:', debugData);
  console.log('Debug data length:', debugData?.length);

  if (!post) return notFound();

  const sidebarContent = (
    <div className="md:p-8 space-y-6">
      <h3 className="text-3xl text-gray-700 text-center font-bold mb-6">
        Popular Posts
      </h3>
      <div className="space-y-6">
        {rankedPosts && rankedPosts.length > 0 ? (
          rankedPosts.slice(0, 5).map((rankedPost) => (
            <div
              key={rankedPost.slug.current}
              className="group cursor-pointer transition-transform transform hover:scale-105"
            >
              <Link href={`/${params.locale}/posts/${rankedPost.slug.current}`}>
                {rankedPost.imageURL && (
                  <div className="overflow-hidden">
                    <img
                      src={rankedPost.imageURL}
                      alt={rankedPost.title[params.locale] || rankedPost.title.ja || rankedPost.title.en || 'Post image'}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}
                <p className="mt-2 text-center font-medium hover:underline">
                  {rankedPost.title[params.locale] || rankedPost.title.ja || rankedPost.title.en || 'Untitled'}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p>No popular posts available</p>
            <p className="text-sm">Debug: {rankedPosts?.length || 0} posts found</p>
            <p className="text-sm">Debug ranking data: {debugData?.length || 0} events with ranking</p>
            {debugData && debugData.length > 0 && (
              <div className="text-xs mt-2">
                <p>Available rankings:</p>
                {debugData.slice(0, 3).map((item, index) => (
                  <p key={index}>
                    {item.title?.en || item.title?.ja || 'No title'} - Ranking: {item.ranking}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PostLayout sidebar={sidebarContent}>
      <article>
        <BackButton />
        <h1 className="text-xl md:text-3xl font-bold mb-4">{post.title[params.locale] || post.title.ja || post.title.en || 'Untitled'}</h1>
        <p className="py-2 text-gray-400 text-xs font-light uppercase">
          {post.date ? convertDate(post.date) : convertDate(post._createdAt)} • {post.authorName || 'Anonymous'}
        </p>
        {post.mainImage && (
          <div className="w-full h-[40vh] relative">
            <Image
              src={post.imageURL || ''}
              alt={post.mainImage.alt || post.title[params.locale] || post.title.ja || post.title.en || 'Post image'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {post.body && (
          <div className="leading-relaxed pt-10">
            <PortableText 
              value={post.body[params.locale] || post.body.ja || post.body.en || []} 
              components={PortableTextComponent} 
            />
          </div>
        )}
      </article>
    </PostLayout>
  );
}

export default function PostDetail({ params }: Props) {
  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetailContent key={`${params.locale}-${params.slug}`} params={params} />
    </Suspense>
  );
}
