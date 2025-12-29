import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Name',
          validation: Rule => Rule.required().min(2).max(50)
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Name',
          validation: Rule => Rule.required().min(2).max(50)
        }
      ],
      description: 'カテゴリのタイトルを入力してね',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'slugを必ず英文字で書いてね',
      options: {
        source: 'name.en',
        maxLength: 100,
      },
      validation: Rule => Rule.required() // Ensures slug is always set
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'LucidaREACT ICONの名前を入力',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'text',
          title: 'English Description',
        },
        {
          name: 'ja',
          type: 'text',
          title: 'Japanese Description',
        }
      ],
    })
  ],
  preview: {
    select: { 
      title: 'name.en',
      subtitle: 'name.ja'
    },
  },
})