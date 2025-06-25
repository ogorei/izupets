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
  name: {
    en: string;
    ja: string;
  };
  type: {
    _id: string;
    name: {
      en: string;
      ja: string;
    } | null;
  };
  slug: {
    _type: string;
    current: string;
  };
  category: {
    _id: string;
    name: {
      en: string;
      ja: string;
    } | null;
  };
  mainImage?: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  description?: {
    en: PortableTextBlock[];
    ja: PortableTextBlock[];
  } | null;
  body?: {
    en: PortableTextBlock[];
    ja: PortableTextBlock[];
  } | null;
  url?: string | null;
  // Pet-friendly specific fields
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
  location: {
    lat: number;
    lng: number;
  };
  tags: {
    en: string[];
    ja: string[];
  };
};