import type { PortableTextBlock } from "next-sanity";

export type Article = {
  _id: string
  _rev: string
  _type: string
  _createdAt: string
  _updatedAt: string
  imageURL: any;
  title: {
    en: string;
    ja: string;
  };
  slug: any;
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
};

export interface Category {
  _id: string;
  name: {
    en: string;
    ja: string;
  };
  slug: {
    current: string;
  };
  icon?: string;
}

export type PetFriendlyProperties = {
  _id: string;
  // Outdoor and Space Features
  outdoorSpace?: boolean;
  outdoorSeating?: boolean;
  gardenArea?: boolean;
  terrace?: boolean;
  balcony?: boolean;
  rooftop?: boolean;

  // Pet-Specific Amenities
  petWaterBowl?: boolean;
  petTreats?: boolean;
  petMenu?: boolean;
  petToys?: boolean;
  petBedding?: boolean;
  petCleaningSupplies?: boolean;
  petWasteDisposal?: boolean;
  petShower?: boolean;
  petGrooming?: boolean;

  // Furniture and Seating Rules
  furnitureRulesRelaxed?: boolean;
  petsAllowedOnFurniture?: boolean;
  petFriendlySeating?: boolean;
  designatedPetAreas?: boolean;

  // Pet Size and Type Restrictions
  smallPetsOnly?: boolean;
  mediumPetsAllowed?: boolean;
  largePetsAllowed?: boolean;
  dogsOnly?: boolean;
  catsAllowed?: boolean;
  otherPetsAllowed?: boolean;

  // Pet Behavior Requirements
  leashRequired?: boolean;
  wellBehavedPets?: boolean;
  vaccinationRequired?: boolean;
  petRegistration?: boolean;

  // Additional Services
  petSitting?: boolean;
  petWalking?: boolean;
  petPhotography?: boolean;
  petEvents?: boolean;
  petTraining?: boolean;

  // Accessibility and Safety
  petFirstAid?: boolean;
  emergencyVetNearby?: boolean;
  petInsuranceAccepted?: boolean;
  wheelchairAccessible?: boolean;
};

// Place Category type (matches placeCategory schema)
export type PlaceCategory = {
  _id: string;
  title: {
    en: string;
    ja: string;
  };
  slug: {
    current: string;
  };
  description?: {
    en?: string;
    ja?: string;
  };
};

// Hotel Details type (category-specific)
export type HotelDetails = {
  checkIn?: string;
  checkOut?: string;
  numberOfRooms?: number;
  roomTypes?: string[];
  petWeightLimit?: string;
  numberOfPetsAllowed?: number;
  petServices?: string[];
};

// Restaurant Details type (category-specific)
export type RestaurantDetails = {
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

export type PetFriendlyLocation = {
  _id: string;
  title: {
    en: string;
    ja: string;
  };
  slug: {
    current: string;
  };
  // New: category reference (replaces placeType enum)
  category?: PlaceCategory;
  // Backward compatibility: categorySlug provides the slug string (replaces placeType)
  categorySlug?: string;
  // Legacy: placeType kept for backward compatibility during migration
  // Frontend code should migrate to use categorySlug or category.slug.current
  placeType?: string;
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
  properties?: PetFriendlyProperties;
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
  // Category-specific fields (only populated for relevant categories)
  hotelDetails?: HotelDetails;
  restaurantDetails?: RestaurantDetails;
}; 