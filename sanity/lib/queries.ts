import { groq } from "next-sanity";

export const postsQuery = groq`*[_type == "event"] {
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

// Get list of categories
export const categoryListQuery = groq`
  *[_type == "category"]{
    _id,
    name,
    slug,
    icon,
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
  url
}
`;

export const getProductsQuery = groq`*[_type == "product"] {
  _id,
  name,
  brand,
  "slug": {
    "current": slug.current
  },
  "category": category->{
    _id,
    name
  },
  "criteria": criteria->{
    _id,
    applicationSmoothness,
    latheringSpeed,
    postWashFeel,
    fluidity,
    transparency,
    instantEfficacyFeel,
    priceCategory,
    refillAvailability,
    alcoholFree,
    allergenFree,
    parabenFree,
    sulfateFree,
    fragranceFree,
    hypoallergenic,
    needForTools,
    travelFriendly,
    suitableForNormalSkin,
    suitableForDrySkin,
    suitableForOilySkin,
    suitableForCombinationSkin,
    suitableForSensitiveSkin,
    waterMerge,
    greasyTexture,
    sizeOptions,
    applicationTime,
    pH,
    brandRemovingMakeup,
    spreadability,
    siliconeFree,
    coolingEffect,
    warmingEffect,
    refreshingSensation
  },
  mainImage,
  description,
  body,
  url
}`;



