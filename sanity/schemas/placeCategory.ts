import { defineField, defineType } from 'sanity'

/**
 * Place Category Schema
 * 
 * Document type for managing place categories (hotel, restaurant, cafe, etc.)
 * Replaces hardcoded enum values with a flexible category system.
 */
export const placeCategory = defineType({
  name: 'placeCategory',
  title: 'Place Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'object',
      title: 'Title',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Title',
          validation: (rule) => rule.required(),
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Title',
          validation: (rule) => rule.required(),
        }
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title.en',
        maxLength: 100,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'object',
      title: 'Description',
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
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'title.ja',
    },
  },
})

