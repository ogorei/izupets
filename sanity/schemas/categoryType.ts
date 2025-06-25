import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'カテゴリのタイトルを入力してね',
      validation: Rule => Rule.required().min(2).max(50) // Optional validation
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'slugを必ず英文字で書いてね',
      options: {
        source: 'name',
        maxLength: 100,
      },
      validation: Rule => Rule.required() // Ensures slug is always set
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'LucidaREACT ICONの名前を入力',
    })
  ],
  preview: {
    select: { title: 'name' },
  },
})