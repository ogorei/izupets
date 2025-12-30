import { groq } from "next-sanity";

// Simple test query to check if we can fetch any events
export const testQuery = groq`*[_type == "event"] | order(_createdAt desc)[0...10] {
  _id,
  _type,
  title,
  slug
}`;

// Debug query to check ranking values
export const debugRankingQuery = groq`*[_type == "event" && !(_id in path("drafts.**"))] {
  _id,
  title,
  slug,
  ranking
} | order(ranking asc)`;

export const postsQuery = groq`*[_type == "event" && !(_id in path("drafts.**"))] {
  _id,
  _rev,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  mainImage,
  category,
  description,
  body,
  "imageURL": mainImage.asset->url,
  "authorName": author->name,
  ranking,
  date,
  url
}`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "event" && slug.current == $slug][0]{
    _id,
    _rev,
    _type,
    _createdAt,
    _updatedAt,
    title,
    description,
    mainImage,
    "imageURL": mainImage.asset->url,
    "authorName": author->name,
    body,
    ranking,
    date,
    url
  }`;

// Get list of categories (for posts/events)
export const categoryListQuery = groq`
  *[_type == "category"]{
    _id,
    name,
    slug,
    icon,
    description
  }
`;

// Get list of place categories (for places)
export const placeCategoryListQuery = groq`
  *[_type == "placeCategory"]{
    _id,
    title,
    slug,
    description
  }
`;

// Get all posts that match a specific category
export const postsByCategoryQuery = groq`
  *[_type == "event" && category->slug.current == $slug]{
    _id,
    _rev,
    _type,
    _createdAt,
    _updatedAt,
    title,
    slug,
    mainImage,
    "imageURL": mainImage.asset->url,
    "authorName": author->name,
    description,
    body,
    ranking,
    date,
    url,
    "category": category->{
      _id,
      name,
      slug
    }
  }
`;

//Get post by Ranking
export const postsByRankingQuery = groq`
*[_type == "event" && !(_id in path("drafts.**"))] | order(ranking asc) {
  _id,
  _rev,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  mainImage,
  "imageURL": mainImage.asset->url,
  "authorName": author->name,
  description,
  body,
  ranking,
  date,
  url
}
`;

// Get all places
// Updated to use the new compositional schema:
// - _type changed from "places" to "place"
// - placeType enum replaced with category reference
// - Only core fields and category-specific fields are fetched
export const placesQuery = groq`*[_type == "place"] {
  _id,
  _rev,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "category": category->{
    _id,
    title,
    slug,
    description
  },
  "categorySlug": category->slug.current,
  hotelDetails,
  restaurantDetails,
  location,
  address,
  contact,
  petFriendlyFeatures,
  openingHours,
  closedDays,
  area,
  source,
  "imageURL": coalesce(restaurantDetails.mainImage.asset->url, hotelDetails.mainImage.asset->url, null)
}`;

// Get a single place by its slug
// Updated to use the new compositional schema:
// - _type changed from "places" to "place"
// - placeType enum replaced with category reference
// - Only core fields and category-specific fields are fetched
export const placeQuery = groq`*[_type == "place" && slug.current == $slug][0]{
  _id,
  _rev,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "category": category->{
    _id,
    title,
    slug,
    description
  },
  "categorySlug": category->slug.current,
  hotelDetails,
  restaurantDetails,
  location,
  address,
  contact,
  petFriendlyFeatures,
  openingHours,
  closedDays,
  area,
  source,
  "imageURL": coalesce(restaurantDetails.mainImage.asset->url, hotelDetails.mainImage.asset->url, null)
}`;

// Get all events (matching eventType schema)
export const eventsQuery = groq`*[_type == "event" && !(_id in path("drafts.**"))] {
  _id,
  _rev,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  mainImage,
  category,
  description,
  body,
  "imageURL": mainImage.asset->url,
  "authorName": author->name,
  ranking,
  date,
  url,
  spotType,
  tags
}`;

// Get events by ranking
export const eventsByRankingQuery = groq`
*[_type == "event"] | order(ranking asc) {
  _id,
  _rev,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  mainImage,
  "imageURL": mainImage.asset->url,
  "authorName": author->name,
  description,
  body,
  ranking,
  date,
  url,
  spotType,
  tags
}
`;

// Get featured places
// Updated to use the new compositional schema:
// - _type changed from "places" to "place"
// - placeType enum replaced with category reference
// - Only core fields and category-specific fields are fetched
export const featuredPlacesQuery = groq`
*[_type == "place"] | order(_createdAt desc) {
  _id,
  _rev,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "category": category->{
    _id,
    title,
    slug,
    description
  },
  "categorySlug": category->slug.current,
  "placeType": coalesce(placeType, null),
  restaurantDetails,
  hotelDetails,
  location,
  address,
  contact,
  petFriendlyFeatures,
  openingHours,
  closedDays,
  area,
  source,
  "imageURL": coalesce(restaurantDetails.mainImage.asset->url, hotelDetails.mainImage.asset->url, null)
}
`;



