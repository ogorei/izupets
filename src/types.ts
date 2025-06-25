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
  name: string;
  slug: {
    current: string;
  };
  icon?:string;
}

export type Criteria = {
  _id: string;
  applicationSmoothness?: number;
  latheringSpeed?: number;
  postWashFeel?: number;
  fluidity?: number;
  transparency?: number;
  instantEfficacyFeel?: number;
  priceCategory?: number;
  refillAvailability?: boolean;
  alcoholFree?: boolean;
  allergenFree?: boolean;
  parabenFree?: boolean;
  sulfateFree?: boolean;
  fragranceFree?: boolean;
  hypoallergenic?: boolean;
  needForTools?: boolean;
  travelFriendly?: boolean;
  suitableForNormalSkin?: boolean;
  suitableForDrySkin?: boolean;
  suitableForOilySkin?: boolean;
  suitableForCombinationSkin?: boolean;
  suitableForSensitiveSkin?: boolean;
  waterMerge?: number;
  greasyTexture?: number;
  sizeOptions?: string[]; // assuming ["S", "M"] type strings
  applicationTime?: number;
  pH?: number;
  brandRemovingMakeup?: boolean;
  spreadability?: number;
  siliconeFree?: boolean;
  coolingEffect?: boolean;
  warmingEffect?: boolean;
  refreshingSensation?: number;
};

export type Product = {
  _id: string;
  name: string | null;
  brand: string | null;
  slug: {
    current: string;
  };
  category: {
    _id: string;
    name: string | null;
  };
  mainImage?: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  description?: any[] | null;
  url?: string | null;
  criteria: Criteria;
}; 