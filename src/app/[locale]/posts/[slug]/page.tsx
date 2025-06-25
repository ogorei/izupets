import type { Article } from "../../../../../types";
import { fetchPostByRanking, fetchPostBySlug } from "../../../../../sanity/lib/fetch";
import { urlFor } from '../../../../../sanity/lib/utils';
import { notFound } from "next/navigation";
import Image from "next/image";
import PostLayout from "@/components/posts/PostLayout";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import type { PortableTextComponents } from '@portabletext/react';
import BackButton from "@/components/BackButton";

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

export default async function PostDetail({ params }: Props) {
  const [post, rankedPosts] = await Promise.all([
    fetchPostBySlug(params.slug),
    fetchPostByRanking(),
  ]) as [Article | null, Article[]];

  if (!post) return notFound();

  const sidebarContent = (
    <div className="md:p-8 space-y-6">
      <h3 className="text-3xl text-gray-700 text-center font-bold mb-6">
        Popular Posts
      </h3>
      <div className="space-y-6">
        {rankedPosts.slice(0, 10).map((rankedPost) => (
          <div
            key={rankedPost.slug.current}
            className="group cursor-pointer transition-transform transform hover:scale-105"
          >
            <Link href={`/${params.locale}/posts/${rankedPost.slug.current}`}>
              {rankedPost.imageURL && (
                <div className="overflow-hidden">
                  <img
                    src={rankedPost.imageURL}
                    alt={rankedPost.title[params.locale]}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              )}
              <p className="mt-2 text-center font-medium hover:underline">
                {rankedPost.title[params.locale]}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PostLayout sidebar={sidebarContent}>
      <article>
        <BackButton />
        <h1 className="text-xl md:text-3xl font-bold mb-4">{post.title[params.locale]}</h1>
        <p className="py-2 text-gray-400 text-xs font-light uppercase">
          {convertDate(post._createdAt)} • {post.authorName}
        </p>
        {post.mainImage && (
          <div className="w-full h-[40vh] relative">
            <Image
              src={post.imageURL}
              alt={post.mainImage.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {post.body && (
          <div className="leading-relaxed pt-10">
            <PortableText 
              value={post.body[params.locale]} 
              components={PortableTextComponent} 
            />
          </div>
        )}
      </article>
    </PostLayout>
  );
}
