import { defineField, defineType } from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Title',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Title',
        }
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title.en' },
      validation: (rule) => rule
        .required()
        .error(`ウェブサイト上のページを生成するために必要だよん`),
    }),
    defineField({
      name: 'ranking',
      title: 'Ranking',
      type: 'number',
      description: 'Set the ranking order (lower numbers appear first)',
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(10)
          .error('ランキングは 1 から 10 の間で設定してね'),
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      description: '記事の投稿日',
    }),
    defineField({
      name: 'spotType',
      type: 'string',
      title: 'Spot Type',
      description: '場所の種類（例：カフェ、ホテル、公園など）',
      options: {
        list: [
          { title: 'Cafe', value: 'cafe' },
          { title: 'Hotel', value: 'hotel' },
          { title: 'Park', value: 'park' },
          { title: 'Activity', value: 'activity' },
          { title: 'Restaurant', value: 'restaurant' },
          { title: 'Other', value: 'other' }
        ]
      }
    }),
    defineField({
      name: 'author',
      type: 'reference',
      description: '記事作成者',
      to: [{ type: 'author' }]
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      description: '記事の上に載せる画像'
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Photo Gallery',
      of: [{ type: 'image' }],
      description: '記事に使いたい複数の写真を追加できる'
    }),
    defineField({
      name: 'description',
      description: '記事の紹介文（文字のみ）',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'array',
          of: [{ type: 'block' }],
          title: 'English Description',
        },
        {
          name: 'ja',
          type: 'array',
          of: [{ type: 'block' }],
          title: 'Japanese Description',
        }
      ],
    }),
    defineField({
      name: 'body',
      description: '記事の本文（画像なども含む）',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  validation: Rule => Rule.required(),
                }
              ],
            },
          ],
          title: 'English Body',
        },
        {
          name: 'ja',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  validation: Rule => Rule.required(),
                }
              ],
            },
          ],
          title: 'Japanese Body',
        }
      ],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'タグを追加することで検索しやすくなるよ（例：ペットカフェ、伊豆、犬旅）'
    }),
    defineField({
      name: 'url',
      type: 'url',
      description: '公式サイトや予約ページがあれば追加'
    }),
  ],
})
