export const useCdn = false

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

export const readToken = process.env.SANITY_API_READ_TOKEN || ''

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21'

// Used to generate URLs for previewing your content
export const DRAFT_MODE_ROUTE = '/api/draft-mode/enable'

/**
 * Used to configure edit intent links, for Presentation Mode, as well as to configure where the Studio is mounted in the router.
 */
export const studioUrl = '/studio'

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}