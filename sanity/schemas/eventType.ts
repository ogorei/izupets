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
      name: 'category',
      type: 'reference',
      description: 'この記事はどのカテゴリーに収納するのかを選択する',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
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
      name: 'description',
      description: '記事の詳細をここに書き込む（文字のみ）',
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
      description: '記事の詳細をここに書き込む（画像なども含む）',
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
      name: 'url',
      type: 'url',
    }),
  ],
})