import { defineField } from 'sanity'

/**
 * Restaurant Details Object
 * 
 * Category-specific fields for restaurant places.
 * Only displayed when the place category is "restaurant" (slug matches).
 * This keeps restaurant-specific data separate from other place types.
 */
export const restaurantDetails = {
  name: 'restaurantDetails',
  type: 'object',
  title: 'Restaurant Details',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Restaurant name',
    }),
    defineField({
      name: 'rating',
      type: 'number',
      title: 'Rating',
      description: 'Restaurant rating (1-5 stars)',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      description: 'Restaurant location',
    }),
    defineField({
      name: 'genre',
      type: 'string',
      title: 'Genre',
      description: 'Cuisine type or genre (e.g., "Italian", "Japanese", "American")',
    }),
    defineField({
      name: 'priceRange',
      type: 'string',
      title: 'Price Range',
      options: {
        list: [
          { title: '$ (Budget)', value: '$' },
          { title: '$$ (Moderate)', value: '$$' },
          { title: '$$$ (Expensive)', value: '$$$' },
          { title: '$$$$ (Very Expensive)', value: '$$$$' },
        ],
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Restaurant description',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Search Tags',
      description: 'Tags for search functionality. Add multiple tags in different languages (e.g., "Japanese", "日本料理", "そば") to help users find this restaurant.',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    // Image fields (preserved from original)
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Main Image',
      description: 'Primary image of the place',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required(),
        }
      ],
    }),
    defineField({
      name: 'images',
      type: 'array',
      title: 'Additional Images',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (rule) => rule.required(),
            }
          ],
        }
      ],
    }),
  ],
}

