import { defineField } from 'sanity'

/**
 * Hotel Details Object
 * 
 * Category-specific fields for hotel places.
 * Only displayed when the place category is "hotel" (slug matches).
 * This keeps hotel-specific data separate from other place types.
 */
export const hotelDetails = {
  name: 'hotelDetails',
  type: 'object',
  title: 'Hotel Details',
  fields: [
    defineField({
      name: 'checkIn',
      type: 'string',
      title: 'Check-In Time',
      description: 'e.g., "3:00 PM"',
    }),
    defineField({
      name: 'checkOut',
      type: 'string',
      title: 'Check-Out Time',
      description: 'e.g., "11:00 AM"',
    }),
    defineField({
      name: 'numberOfRooms',
      type: 'number',
      title: 'Number of Pet-Friendly Rooms',
    }),
    defineField({
      name: 'roomTypes',
      type: 'array',
      title: 'Pet-Friendly Room Types',
      of: [{ type: 'string' }],
      description: 'e.g., "Standard Room", "Suite", "Cottage"',
    }),
    defineField({
      name: 'petWeightLimit',
      type: 'string',
      title: 'Pet Weight Limit',
      description: 'e.g., "No limit", "Up to 50 lbs"',
    }),
    defineField({
      name: 'numberOfPetsAllowed',
      type: 'number',
      title: 'Number of Pets Allowed per Room',
    }),
    defineField({
      name: 'petServices',
      type: 'array',
      title: 'Pet Services',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Pet Sitting', value: 'pet-sitting' },
          { title: 'Pet Walking', value: 'pet-walking' },
          { title: 'Pet Grooming', value: 'pet-grooming' },
          { title: 'Pet Daycare', value: 'pet-daycare' },
          { title: 'Pet Spa', value: 'pet-spa' },
        ],
      },
    }),
    defineField({
      name: 'priceRange',
      type: 'string',
      title: 'Price Range',
      description: 'Price range for accommodation (e.g., "税込 8,800円〜", "From ¥8,800")',
    }),
  ],
}


