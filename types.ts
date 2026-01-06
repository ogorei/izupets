import type { PortableTextBlock } from "next-sanity";

export type PetFriendlySpot = {
  _id: string
  _rev: string
  _type: string
  _createdAt: string
  _updatedAt: string
  imageURL: string;
  title: {
    en: string;
    ja: string;
  };
  slug: {
    current: string;
  };
  mainImage: {
    _type: "image";
    alt: string;
    asset: {
      _ref: string;
      _type: "reference";
    };
  } | null;
  body: {
    en: PortableTextBlock[];
    ja: PortableTextBlock[];
  } | null;
  description: {
    en: PortableTextBlock[];
    ja: PortableTextBlock[];
  } | null;
  authorName: string | null;
  authorImage: string | null;
  authorTwitter: string | null;
  // Pet-specific fields
  petFriendlyFeatures: {
    en: string[];
    ja: string[];
  };
  petSizeRestrictions: {
    en: string;
    ja: string;
  };
  petFees: {
    en: string;
    ja: string;
  };
  address: {
    en: string;
    ja: string;
  };
  phoneNumber: string;
  website: string;
  hours: {
    en: string;
    ja: string;
  };
  rating: number;
};

export interface PetActivityType {
  _id: string;
  name: {
    en: string;
    ja: string;
  };
  slug: {
    current: string;
  };
  icon?: string;
  description: {
    en: string;
    ja: string;
  };
}

export type PetFriendlyLocation = {
  _id: string;
  _rev: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  title: {
    en: string;
    ja: string;
  };
  slug: {
    _type: string;
    current: string;
  };
  placeType: string;
  mainImage?: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  images?: Array<{
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  }>;
  description?: {
    en: PortableTextBlock[];
    ja: PortableTextBlock[];
  } | null;
  address?: {
    en?: string;
    ja?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  petFriendlyFeatures?: {
    dogsAllowed?: boolean;
    catsAllowed?: boolean;
    otherPetsAllowed?: boolean;
    sizeRestrictions?: string;
    leashRequired?: boolean;
    petFees?: string;
    petAmenities?: string[];
    petRules?: string[];
  };
  properties?: {
    _id: string;
    _type: string;
    // Add properties fields as needed
  };
  hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    notes?: string;
  };
  rating?: number;
  priceRange?: string;
  featured?: boolean;
  publishedAt?: string;
  lastUpdated?: string;
  imageURL?: string;
  category?: {
    _id: string;
    name?: {
      en: string;
      ja: string;
    } | null;
    slug?: {
      current: string;
    };
  };
  // Category-specific fields (only populated for relevant categories)
  hotelDetails?: {
    checkIn?: string;
    checkOut?: string;
    numberOfRooms?: number;
    roomTypes?: string[];
    petWeightLimit?: string;
    numberOfPetsAllowed?: number;
    petServices?: string[];
  };
  restaurantDetails?: {
    name?: string;
    rating?: number;
    location?: string;
    genre?: string;
    priceRange?: string;
    description?: string;
    tags?: string[];
    mainImage?: {
      _type: string;
      asset: {
        _ref: string;
        _type: string;
      };
      alt?: string;
    };
    images?: Array<{
      _type: string;
      asset: {
        _ref: string;
        _type: string;
      };
      alt?: string;
    }>;
  };
};

export type Event = {
  _id: string;
  _rev: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  title: {
    en: string;
    ja: string;
  };
  slug: {
    current: string;
  };
  ranking: number;
  date?: string;
  category: {
    _id: string;
    name?: {
      en: string;
      ja: string;
    } | null;
    slug?: {
      current: string;
    };
  };
  spotType?: string;
  author?: {
    _id: string;
    name?: string;
  };
  mainImage?: {
    _type: "image";
    alt?: string;
    asset: {
      _ref: string;
      _type: "reference";
    };
  } | null;
  gallery?: Array<{
    _type: "image";
    alt?: string;
    asset: {
      _ref: string;
      _type: "reference";
    };
  }>;
  description?: {
    en: PortableTextBlock[];
    ja: PortableTextBlock[];
  } | null;
  body?: {
    en: PortableTextBlock[];
    ja: PortableTextBlock[];
  } | null;
  tags?: string[];
  url?: string;
  imageURL?: string;
  authorName?: string;
};