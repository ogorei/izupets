import {client} from "./utils";
import { postsQuery, postQuery, categoryListQuery, postsByCategoryQuery, postsByRankingQuery } from "./queries";

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