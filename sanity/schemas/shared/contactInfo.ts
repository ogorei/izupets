import { defineField } from 'sanity'

/**
 * Contact Information Object
 * 
 * Reusable object for contact details shared across all place types.
 * Extracted to avoid duplication and maintain consistency.
 */
export const contactInfo = {
  name: 'contact',
  type: 'object',
  title: 'Contact Information',
  fields: [
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Phone Number',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
    }),
    defineField({
      name: 'website',
      type: 'url',
      title: 'Website',
    }),
    defineField({
      name: 'socialMedia',
      type: 'object',
      title: 'Social Media',
      fields: [
        {
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
        },
        {
          name: 'facebook',
          type: 'url',
          title: 'Facebook',
        },
        {
          name: 'twitter',
          type: 'url',
          title: 'Twitter/X',
        },
      ],
    }),
  ],
}


