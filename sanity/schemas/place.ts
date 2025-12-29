import { defineField, defineType } from 'sanity'
import { hotelDetails } from './categories/hotelDetails'
import { restaurantDetails } from './categories/restaurantDetails'

/**
 * Place Schema (Simplified)
 * 
 * Minimal schema containing only:
 * - Core identification fields (title, slug)
 * - Category reference
 * - Category-specific fields (hotelDetails, restaurantDetails)
 */
export const place = defineType({
  name: 'place',
  title: 'Pet-Friendly Place',
  description: 'Pet-friendly restaurants, hotels, and other locations',
  type: 'document',
  fields: [
    // Core identification fields
    defineField({
      name: 'title',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Name',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Name',
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
        .error('Slug is required for generating web pages'),
    }),
    
    // Category reference
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'placeCategory' }],
      title: 'Place Category',
      description: 'Select the category for this place (e.g., Hotel, Restaurant, Cafe)',
      validation: (rule) => rule.required(),
    }),

    // Category-specific fields - Hotel Details
    defineField({
      ...hotelDetails,
      description: 'Hotel-specific details. Only fill this if the place category is "hotel".',
    }),

    // Category-specific fields - Restaurant Details
    defineField({
      ...restaurantDetails,
      description: 'Restaurant-specific details. Only fill this if the place category is "restaurant".',
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      categoryTitle: 'category.title.en',
      categorySlug: 'category.slug.current',
    },
    prepare(selection) {
      const { title, categoryTitle, categorySlug } = selection
      return {
        title: title || 'Untitled',
        subtitle: categoryTitle || categorySlug || 'No category',
      }
    },
  },
})

