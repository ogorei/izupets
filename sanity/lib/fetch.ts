import {client} from "./utils";
import { postsQuery, postQuery, categoryListQuery, postsByCategoryQuery, postsByRankingQuery, placesQuery, placeQuery, testQuery, eventsQuery, eventsByRankingQuery, featuredPlacesQuery, debugRankingQuery, placeCategoryListQuery } from "./queries";

// Test function to check if we can fetch any events
export async function testFetch() {
  return client.fetch(testQuery);
}

// Debug function to check ranking values
export async function debugRanking() {
  return client.fetch(debugRankingQuery);
}

// Fetch all posts
export async function fetchPost(){
  return client.fetch(postsQuery);
}

// Fetch a single post by slug
export async function fetchPostBySlug(slug: string) {
   return client.fetch(postQuery, { slug });
}

// Fetch all categories
export async function fetchAllCategories() {
  return client.fetch(categoryListQuery);
}
export async function fetchPostsByCategory(slug: string) {
  return client.fetch(postsByCategoryQuery, { slug });
}
//Fetch Post by Category
export async function fetchPostByRanking() {
  const result = await client.fetch(postsByRankingQuery);
  return result;
}

// Fetch all places (replaces fetchProducts)
export async function fetchPlaces() {
  return client.fetch(placesQuery);
}

// Fetch a single place by slug
export async function fetchPlaceBySlug(slug: string) {
  return client.fetch(placeQuery, { slug });
}

// Legacy function for backward compatibility (maps to fetchPlaces)
export async function fetchProducts() {
  return fetchPlaces();
}

// Fetch all events (matching eventType schema)
export async function fetchEvents(){
  return client.fetch(eventsQuery);
}

// Fetch events by ranking
export async function fetchEventsByRanking() {
  const result = await client.fetch(eventsByRankingQuery);
  return result;
}

// Fetch featured places
export async function fetchFeaturedPlaces() {
  return client.fetch(featuredPlacesQuery);
}

// Fetch all place categories
export async function fetchPlaceCategories() {
  return client.fetch(placeCategoryListQuery);
}