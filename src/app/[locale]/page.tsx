import HomeLayout from "@/components/home/HomeLayout";
import { iconMap } from "@/utils/iconMap";
import { fetchPost, fetchPostByRanking } from "../../../sanity/lib/fetch";
import type { Category, Article } from "../../../types";
import Banner from "../../components/home/Banner";
import PostCard from "@/components/posts/PostCard";
import { fetchAllCategories } from "../../../sanity/lib/fetch";
import Link from "next/link";
import { translateCategory } from "@/utils/category";
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
  const posts = await fetchPost();
  const categories = await fetchAllCategories();
  const rankedPosts = await fetchPostByRanking();
  const pageExists = true;

  if (!pageExists) {
    return <NotFound locale={params.locale} />;
  }

  const convertDate = (date: string) =>
    new Date(date).toISOString().slice(0, 10).replace(/-/g, "/");

  const sidebarContent = (
    <div className="space-y-6">
      {/* Categories Box - Hidden on mobile */}
      <div className="p-4 hidden lg:block">
        <div className="flex items-center w-full mb-4">
          <h3 className="text-xl text-gray-500 whitespace-nowrap">CATEGORIES</h3>
          <div className="flex-1 h-0.5 bg-gray-100 ml-4"></div>
        </div>
        <nav className="mt-6">
          <ul className="grid grid-cols-2 gap-2 auto-rows-min">
            {categories.map((category: Category) => {
              const IconComponent = iconMap[category?.icon as keyof typeof iconMap];
              return (
                <li key={category.slug.current} className="border hover:bg-categories border-categories flex items-center justify-center gap-2 p-2 transition">
                  <Link
                    href={`/${params.locale}/category/${category.slug.current}`}
                    className="flex items-center gap-2 text-gray-500 hover:text-accent transition duration-300 w-auto min-w-0"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                    <span className="truncate text-sm sm:text-base text-center">
                      {translateCategory(category.name, params.locale)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Ranking Box */}
      <div className="p-4">
        <div className="flex items-center w-full mb-4">
          <h3 className="text-xl text-gray-500 whitespace-nowrap">TOP POSTS</h3>
          <div className="flex-1 h-0.5 bg-gray-100 ml-4"></div>
        </div>
        <nav className="mt-6">
          <ul className="space-y-3">
            {rankedPosts.slice(0, 10).map((post: Article, index: number) => (
              <li key={post.slug.current} className="border hover:bg-gray-50 p-2 rounded transition">
                <Link
                  href={`/${params.locale}/posts/${post.slug.current}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-accent transition duration-300"
                >
                  <span className="font-bold text-accent">{index + 1}.</span>
                  {post.imageURL && (
                    <img
                      src={post.imageURL}
                      alt={post.title[params.locale]}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <span className="truncate text-sm flex-1">{post.title[params.locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  return (
    <HomeLayout sidebar={sidebarContent}>
      {posts.length > 0 && <Banner post={posts[0]} locale={params.locale} categories={categories} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.slice(1).map((post: Article) => {
          const description = post.description?.[params.locale];
          const plainTextDescription = description ? extractPlainText(description) : undefined;

          return (
            <PostCard
              key={post._id}
              id={post._id}
              slug={post.slug.current}
              title={post.title[params.locale]}
              description={plainTextDescription}
              createdAt={post._createdAt}
              authorName={post.authorName}
              imageURL={post.imageURL}
              imageAlt={post.mainImage?.alt}
              locale={params.locale}
              convertDate={convertDate}
            />
          );
        })}
      </div>
    </HomeLayout>
  )
}