import { defineField, defineType } from 'sanity'
import { hotelDetails } from './categories/hotelDetails'
import { restaurantDetails } from './categories/restaurantDetails'
import { contactInfo } from './shared/contactInfo'
import { petPolicy } from './shared/petPolicy'

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

    // Contact Information
    defineField({
      ...contactInfo,
      description: 'Contact information for this place (phone, email, website, social media).',
    }),

    // Pet-Friendly Features
    defineField({
      ...petPolicy,
      description: 'Pet-friendly features and policies for this place.',
    }),

    // Location fields
    defineField({
      name: 'address',
      type: 'object',
      title: 'Address',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Address',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Address',
        },
        {
          name: 'full',
          type: 'string',
          title: 'Full Address',
          description: 'Complete address string',
        },
      ],
    }),
    defineField({
      name: 'location',
      type: 'geopoint',
      title: 'Location',
      description: 'Geographic coordinates (latitude, longitude)',
    }),
    defineField({
      name: 'openingHours',
      type: 'object',
      title: 'Opening Hours',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Opening Hours',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Opening Hours',
        },
      ],
    }),
    defineField({
      name: 'closedDays',
      type: 'string',
      title: 'Closed Days',
      description: 'Days when the place is closed (e.g., "Monday", "月曜日")',
    }),
    defineField({
      name: 'area',
      type: 'string',
      title: 'Area/Region',
      description: 'Geographic area or region (e.g., "南アルプス", "Southern Alps")',
    }),
    defineField({
      name: 'source',
      type: 'string',
      title: 'Data Source',
      description: 'Source of the scraped data (e.g., "izu-wanko", "pet-inu-yado")',
      readOnly: true,
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

