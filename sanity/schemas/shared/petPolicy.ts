import { defineField } from 'sanity'

/**
 * Pet Policy Object
 * 
 * Reusable object for pet-friendly features and policies shared across all place types.
 * Extracted to avoid duplication while maintaining the ability to customize per category.
 */
export const petPolicy = {
  name: 'petFriendlyFeatures',
  type: 'object',
  title: 'Pet-Friendly Features',
  fields: [
    defineField({
      name: 'dogsAllowed',
      type: 'boolean',
      title: 'Dogs Allowed',
    }),
    defineField({
      name: 'catsAllowed',
      type: 'boolean',
      title: 'Cats Allowed',
    }),
    defineField({
      name: 'otherPetsAllowed',
      type: 'boolean',
      title: 'Other Pets Allowed',
    }),
    defineField({
      name: 'sizeRestrictions',
      type: 'string',
      title: 'Size Restrictions',
      description: 'e.g., "Small dogs only", "No size restrictions"',
    }),
    defineField({
      name: 'leashRequired',
      type: 'boolean',
      title: 'Leash Required',
    }),
    defineField({
      name: 'petFees',
      type: 'string',
      title: 'Pet Fees',
      description: 'e.g., "$25 per night", "Free", "Varies"',
    }),
    defineField({
      name: 'petAmenities',
      type: 'array',
      title: 'Pet Amenities',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Pet Beds', value: 'pet-beds' },
          { title: 'Pet Bowls', value: 'pet-bowls' },
          { title: 'Pet Treats', value: 'pet-treats' },
          { title: 'Pet Toys', value: 'pet-toys' },
          { title: 'Pet Menu', value: 'pet-menu' },
          { title: 'Pet Water Stations', value: 'pet-water-stations' },
          { title: 'Pet Waste Bags', value: 'pet-waste-bags' },
          { title: 'Pet Grooming Services', value: 'pet-grooming' },
          { title: 'Pet Sitting Services', value: 'pet-sitting' },
          { title: 'Pet Play Area', value: 'pet-play-area' },
          { title: 'Pet-Friendly Rooms', value: 'pet-friendly-rooms' },
          { title: 'Pet Relief Area', value: 'pet-relief-area' },
        ],
      },
    }),
    defineField({
      name: 'petRules',
      type: 'array',
      title: 'Pet Rules & Policies',
      of: [{ type: 'string' }],
      description: 'List of specific rules for pets',
    }),
  ],
}



