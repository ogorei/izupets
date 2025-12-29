import AboutLayout from '@/components/about/AboutLayout';
import TranslationWrapper from '@/components/about/TranslationWrapper';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import type { Category } from "../../../../types";
import { iconMap } from '@/utils/iconMap';
import Tabs from '@/components/about/Tabs';
import { fetchAllCategories, fetchPostByRanking } from '../../../../sanity/lib/fetch';


interface Achievement {
  period: string;
  details: string;
  url: string;
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const categories = await fetchAllCategories();
  const rankedPosts = await fetchPostByRanking();
  const achievements: Achievement[] = [
    {
      period: '2022年',
      details: 'Removal of a Model Biofilm by Sophorolipid Solutions: A QCM-D Study',
      url: 'https://www.jstage.jst.go.jp/article/jos/71/5/71_ess21360/_article/-char/ja/'
    },
    {
      period: '2024年',
      details: 'Interaction between Sophorolipids and β-glucan in Aqueous Solutions',
      url: 'https://www.jstage.jst.go.jp/article/jos/73/2/73_ess23189/_article/-char/ja/'
    }
  ];

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
            {categories.map((category: Category) => {
              const IconComponent = iconMap[category?.icon as keyof typeof iconMap];
              return (
                <li key={category.slug.current} className="border hover:bg-categories border-categories flex items-center gap-2 p-2 transition">
                  <Link
                    href={`/${params.locale}/category/${category.slug.current}`}
                    className="flex items-center gap-2 text-gray-500 hover:text-accent transition duration-300 w-full"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                    <span className="text-sm sm:text-base">
                      {category.name[params.locale as 'en' | 'ja']}
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
            {rankedPosts.slice(0, 10).map((post: any, index: number) => (
              <li key={post.slug.current} className="border hover:bg-gray-50 p-2 rounded transition">
                <Link
                  href={`/${params.locale}/posts/${post.slug.current}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-accent transition duration-300"
                >
                  <span className="font-bold text-accent">{index + 1}.</span>
                  {post.imageURL && (
                    <img
                      src={post.imageURL}
                      alt={post.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <span className="truncate text-sm flex-1">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  return (
    <TranslationWrapper keys={['AboutPage.specialist', 'AboutPage.introduction', 'AboutPage.period', 'AboutPage.message', 'AboutPage.background', 'AboutPage.purpose', 'AboutPage.description', 'AboutPage.name', 'AboutPage.qualifications', 'AboutPage.experience1', 'AboutPage.experience2', 'AboutPage.publications', 'AboutPage.publications1', 'AboutPage.skills.skill1', 'AboutPage.skills.skill2']}>
      {(translations) => (
        <AboutLayout sidebar={sidebarContent}>
          <div className="container mx-auto py-8">
            <div className="mb-8">
              <h1 className="text-3xl text-center font-bold mb-4">
                <span className="text-accent">{translations['AboutPage.specialist']}</span>{translations['AboutPage.introduction']}
              </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-40 h-40 mb-6">
                      <Image
                        src=""
                        alt="profile"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="text-center mb-8">
                      <p>{translations['AboutPage.description']}</p>
                      <p className="text-accent text-2xl font-bold">{translations['AboutPage.name']}</p>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="mb-4">
                      <p>{translations['AboutPage.background']}</p>
                      <p>{translations['AboutPage.purpose']}</p>
                      <p>{translations['AboutPage.message']}</p>
                    </div>

                    <div className="mb-4">
                      <p>{translations['AboutPage.qualifications']}</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>{translations['AboutPage.experience1']}</li>
                        <li>{translations['AboutPage.experience2']}</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <p>{translations['AboutPage.publications']}</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>{translations['AboutPage.publications1']}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs
                skills={[translations['AboutPage.skills.skill1'], translations['AboutPage.skills.skill2']]}
                achievements={achievements.map((achievement) => ({
                  ...achievement,
                  period: translations['AboutPage.period'] + ": " + achievement.period,
                  url: achievement.url,
                }))}
              />
            </div>
          </div>
        </AboutLayout>
      )}
    </TranslationWrapper>
  );
}
