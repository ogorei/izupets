/**
 * Import Scraped Data to Sanity
 * 
 * Imports scraped pet-friendly places data into Sanity CMS.
 * Adapted from Project B's Python import logic, but saves to Sanity instead of SQLite.
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';
import { geocodeAddress, GeocodeOptions } from '../utils/geocoding';
import { translatePlace, TranslationOptions } from '../utils/translation';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-06-21',
  token: process.env.SANITY_API_WRITE_TOKEN || '', // Need write token for mutations
});

interface ScrapedPlace {
  name: string;
  source: string;
  description?: string;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  closed_days?: string;
  pet_policy?: string;
  place_type?: string;
  detail_url?: string;
  full_address?: string;
  price_range?: string;
  area?: string;
  features?: string[];
  [key: string]: any;
}

interface PlaceCategory {
  _id: string;
  slug: { current: string };
}

/**
 * Get or create a place category
 */
async function getOrCreateCategory(
  categorySlug: string,
  titleEn: string,
  titleJa: string
): Promise<string> {
  // Try to find existing category
  const existing = await client.fetch<PlaceCategory[]>(
    `*[_type == "placeCategory" && slug.current == $slug][0]`,
    { slug: categorySlug }
  );

  if (existing) {
    return existing._id;
  }

  // Create new category
  const newCategory = await client.create({
    _type: 'placeCategory',
    title: {
      en: titleEn,
      ja: titleJa,
    },
    slug: {
      current: categorySlug,
      _type: 'slug',
    },
  });

  return newCategory._id;
}

/**
 * Extract prefecture from address (for future use if needed)
 */
function extractPrefectureFromAddress(address: string): string | null {
  if (!address) return null;

  const prefecturePatterns: { [key: string]: string } = {
    '北海道': 'hokkaido',
    '青森県': 'aomori',
    '岩手県': 'iwate',
    '宮城県': 'miyagi',
    '秋田県': 'akita',
    '山形県': 'yamagata',
    '福島県': 'fukushima',
    '茨城県': 'ibaraki',
    '栃木県': 'tochigi',
    '群馬県': 'gunma',
    '埼玉県': 'saitama',
    '千葉県': 'chiba',
    '東京都': 'tokyo',
    '神奈川県': 'kanagawa',
    '新潟県': 'niigata',
    '富山県': 'toyama',
    '石川県': 'ishikawa',
    '福井県': 'fukui',
    '山梨県': 'yamanashi',
    '長野県': 'nagano',
    '岐阜県': 'gifu',
    '静岡県': 'shizuoka',
    '愛知県': 'aichi',
    '三重県': 'mie',
    '滋賀県': 'shiga',
    '京都府': 'kyoto',
    '大阪府': 'osaka',
    '兵庫県': 'hyogo',
    '奈良県': 'nara',
    '和歌山県': 'wakayama',
    '鳥取県': 'tottori',
    '島根県': 'shimane',
    '岡山県': 'okayama',
    '広島県': 'hiroshima',
    '山口県': 'yamaguchi',
    '徳島県': 'tokushima',
    '香川県': 'kagawa',
    '愛媛県': 'ehime',
    '高知県': 'kochi',
    '福岡県': 'fukuoka',
    '佐賀県': 'saga',
    '長崎県': 'nagasaki',
    '熊本県': 'kumamoto',
    '大分県': 'oita',
    '宮崎県': 'miyazaki',
    '鹿児島県': 'kagoshima',
    '沖縄県': 'okinawa',
  };

  for (const [prefName, slug] of Object.entries(prefecturePatterns)) {
    if (address.includes(prefName)) {
      return slug;
    }
  }

  return null;
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if place already exists
 */
async function placeExists(name: string, categoryId: string): Promise<boolean> {
  const existing = await client.fetch(
    `*[_type == "place" && title.en == $name && category._ref == $categoryId][0]`,
    { name, categoryId }
  );
  return !!existing;
}

/**
 * Geocode address if coordinates are missing
 */
async function ensureCoordinates(
  placeData: ScrapedPlace,
  options: GeocodeOptions = {}
): Promise<{ lat: number; lng: number } | null> {
  // If coordinates already exist, return them
  if (placeData.latitude !== undefined && placeData.longitude !== undefined) {
    return {
      lat: placeData.latitude,
      lng: placeData.longitude,
    };
  }

  // Try to geocode the address
  const address = placeData.address || placeData.full_address || '';
  if (!address) {
    return null;
  }

  console.log(`  🔍 Geocoding address for ${placeData.name}: ${address}`);
  const geocodeResult = await geocodeAddress(address, options);
  
  if (geocodeResult) {
    return {
      lat: geocodeResult.latitude,
      lng: geocodeResult.longitude,
    };
  }

  return null;
}

/**
 * Map Japanese feature text to English pet amenity values
 */
function mapFeatureToPetAmenity(feature: string): string | null {
  const featureLower = feature.toLowerCase();
  
  // Map common Japanese pet features to English amenity values
  const featureMap: { [key: string]: string } = {
    'ドッグラン': 'pet-play-area',
    'プライベートドッグラン': 'pet-play-area',
    '共有ドッグラン': 'pet-play-area',
    'ワンちゃんのお食事': 'pet-menu',
    'ワンちゃんの宿泊料金無料': 'pet-friendly-rooms',
    'ワンちゃん同伴可能なレストラン': 'pet-menu',
    'ペットメニュー': 'pet-menu',
    'ペット用ベッド': 'pet-beds',
    'ペット用食器': 'pet-bowls',
    'ペット用おもちゃ': 'pet-toys',
    'ペット用おやつ': 'pet-treats',
    'ペット用給水': 'pet-water-stations',
    'ペット用トイレ': 'pet-relief-area',
    'ペットシッター': 'pet-sitting',
    'ペット散歩': 'pet-walking',
    'ペットグルーミング': 'pet-grooming',
  };

  // Check for exact matches first
  for (const [japanese, english] of Object.entries(featureMap)) {
    if (feature.includes(japanese)) {
      return english;
    }
  }

  // Check for partial matches
  if (featureLower.includes('ドッグラン') || featureLower.includes('dog run')) {
    return 'pet-play-area';
  }
  if (featureLower.includes('お食事') || featureLower.includes('メニュー') || featureLower.includes('menu')) {
    return 'pet-menu';
  }
  if (featureLower.includes('ベッド') || featureLower.includes('bed')) {
    return 'pet-beds';
  }
  if (featureLower.includes('食器') || featureLower.includes('bowl')) {
    return 'pet-bowls';
  }

  return null;
}

/**
 * Build pet policy object from scraped data
 */
function buildPetPolicy(placeData: ScrapedPlace): any {
  const petPolicyText = placeData.pet_policy || '';
  const features = placeData.features || [];
  
  // If no pet policy text and no features, return undefined
  if (!petPolicyText && features.length === 0) {
    return undefined;
  }

  // Parse pet policy text to extract information
  const policy: any = {};
  
  // Check for size restrictions
  if (petPolicyText.includes('大型犬') || petPolicyText.includes('大型')) {
    policy.sizeRestrictions = 'Large dogs allowed';
  } else if (petPolicyText.includes('小型') || petPolicyText.includes('小・中型')) {
    policy.sizeRestrictions = 'Small/Medium dogs only';
  } else if (petPolicyText.includes('小型犬') || petPolicyText.includes('小')) {
    policy.sizeRestrictions = 'Small dogs only';
  }

  // Check for leash requirements
  if (petPolicyText.includes('リード') || petPolicyText.includes('リーシュ')) {
    policy.leashRequired = true;
  }

  // Check if pets are allowed
  if (petPolicyText.includes('OK') || petPolicyText.includes('可') || petPolicyText.includes('可能')) {
    policy.dogsAllowed = true;
  } else if (petPolicyText.includes('不可') || petPolicyText.includes('NG')) {
    policy.dogsAllowed = false;
  }

  // Store raw policy text in rules
  if (petPolicyText) {
    policy.petRules = [petPolicyText];
  }

  // Map features array to petAmenities
  if (features.length > 0) {
    const petAmenities: string[] = [];
    for (const feature of features) {
      const amenity = mapFeatureToPetAmenity(feature);
      if (amenity) {
        petAmenities.push(amenity);
      }
    }
    if (petAmenities.length > 0) {
      policy.petAmenities = petAmenities;
    }
  }

  return Object.keys(policy).length > 0 ? policy : undefined;
}

/**
 * Build contact info object from scraped data
 */
function buildContactInfo(placeData: ScrapedPlace): any {
  const contact: any = {};

  if (placeData.phone) {
    contact.phone = placeData.phone;
  }

  if (placeData.detail_url) {
    contact.website = placeData.detail_url;
  }

  if (placeData.map_url) {
    contact.mapUrl = placeData.map_url;
  }

  if (placeData.recommendation_url) {
    contact.recommendationUrl = placeData.recommendation_url;
  }

  return Object.keys(contact).length > 0 ? contact : undefined;
}

/**
 * Get translation options from environment variables
 */
function getTranslationOptions(): TranslationOptions | undefined {
  const enableTranslation = process.env.ENABLE_TRANSLATION === 'true';
  if (!enableTranslation) {
    return undefined;
  }

  return {
    service: (process.env.TRANSLATION_SERVICE as any) || 'google',
    apiKey: process.env.TRANSLATION_API_KEY,
    sourceLanguage: 'ja',
    targetLanguage: 'en',
    delay: 100, // 100ms delay between translations
  };
}

/**
 * Import Izu Wanko restaurants/cafes
 */
async function importIzuWankoRestaurants(
  jsonFile: string,
  dryRun: boolean = false
): Promise<void> {
  console.log(`📂 Loading data from ${jsonFile}...`);

  const fileContent = fs.readFileSync(jsonFile, 'utf-8');
  const restaurants: ScrapedPlace[] = JSON.parse(fileContent);

  console.log(`✅ Loaded ${restaurants.length} restaurants/cafes`);

  // Get or create category
  const categoryId = await getOrCreateCategory(
    'restaurant',
    'Restaurant',
    'レストラン'
  );
  console.log(`✅ Using category ID: ${categoryId}`);

  const stats = {
    placesCreated: 0,
    placesSkipped: 0,
    placesNoCoords: 0,
    placesGeocoded: 0,
  };

  // Geocoding options
  const geocodeOptions: GeocodeOptions = {
    service: (process.env.GEOCODING_SERVICE as any) || 'nominatim',
    apiKey: process.env.GEOCODING_API_KEY,
    delay: 1000, // 1 second delay for Nominatim
    countryCode: 'JP',
  };

  // Check if geocoding is enabled
  const enableGeocoding = process.env.ENABLE_GEOCODING !== 'false';
  
  // Get translation options
  const translationOptions = getTranslationOptions();
  const enableTranslation = translationOptions !== undefined;

  for (let i = 0; i < restaurants.length; i++) {
    const restData = restaurants[i];
    const name = restData.name?.trim();
    if (!name) continue;

    const address = restData.address || restData.full_address || '';

    // Try to get coordinates (from scraped data or geocoding)
    let coords = await ensureCoordinates(restData, enableGeocoding ? geocodeOptions : undefined);
    
    if (!coords) {
      stats.placesNoCoords++;
      if (i < 5) {
        console.log(`  ⏭️  Skipping ${name}: No coordinates (address: ${address || 'N/A'})`);
      }
      continue;
    }

    // Track if we geocoded this place
    if (restData.latitude === undefined && coords) {
      stats.placesGeocoded++;
    }

    const lat = coords.lat;
    const lng = coords.lng;

    // Check if already exists
    if (!dryRun && await placeExists(name, categoryId)) {
      stats.placesSkipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  Would create: ${name} (${lat}, ${lng}) - ${address}`);
      stats.placesCreated++;
      continue;
    }

    // Translate if enabled
    let translated: any = {};
    if (enableTranslation && translationOptions) {
      try {
        translated = await translatePlace({
          name: name,
          description: restData.description,
          address: address,
          pet_policy: restData.pet_policy,
          opening_hours: restData.opening_hours,
          closed_days: restData.closed_days,
        }, translationOptions);
      } catch (error) {
        console.warn(`  ⚠️  Translation failed for ${name}, using Japanese only:`, error);
      }
    }

    // Build description from available fields
    const descParts: string[] = [];
    if (restData.description) {
      descParts.push(restData.description);
    }
    if (restData.pet_policy) {
      descParts.push(`ペット対応: ${restData.pet_policy}`);
    }
    if (restData.opening_hours) {
      descParts.push(`営業時間: ${restData.opening_hours}`);
    }
    if (restData.closed_days) {
      descParts.push(`定休日: ${restData.closed_days}`);
    }

    // Determine place type for category
    const placeType = restData.place_type || 'restaurant';
    let finalCategoryId = categoryId;
    
    if (placeType === 'cafe') {
      finalCategoryId = await getOrCreateCategory('cafe', 'Cafe', 'カフェ');
    }

    // Build contact info and pet policy
    const contact = buildContactInfo(restData);
    const petPolicy = buildPetPolicy(restData);

    // Create place document
    try {
      const placeDoc: any = {
        _type: 'place',
        title: {
          en: translated.name || name, // Use translated name if available, otherwise Japanese
          ja: name,
        },
        slug: {
          current: generateSlug(name),
          _type: 'slug',
        },
        category: {
          _type: 'reference',
          _ref: finalCategoryId,
        },
        restaurantDetails: {
          name: name,
          description: descParts.join('\n') || undefined,
          location: address || undefined,
          genre: undefined, // Could be extracted from description
        },
        location: {
          _type: 'geopoint',
          lat: lat,
          lng: lng,
        },
      };

      // Add address if available
      if (address) {
        placeDoc.address = {
          en: translated.address || undefined,
          ja: address,
          full: address,
        };
      }

      // Add opening hours if available
      if (restData.opening_hours) {
        placeDoc.openingHours = {
          en: translated.opening_hours || undefined,
          ja: restData.opening_hours,
        };
      }

      // Add closed days if available
      if (restData.closed_days) {
        placeDoc.closedDays = restData.closed_days;
      }

      // Add contact info if available
      if (contact) {
        placeDoc.contact = contact;
      }

      // Add pet policy if available
      if (petPolicy) {
        placeDoc.petFriendlyFeatures = petPolicy;
      }

      // Add source
      if (restData.source) {
        placeDoc.source = restData.source;
      }

      await client.create(placeDoc);
      stats.placesCreated++;

      if ((i + 1) % 10 === 0) {
        console.log(`  Processed ${i + 1}/${restaurants.length}...`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to create ${name}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Statistics:');
  console.log(`   Created: ${stats.placesCreated}`);
  console.log(`   Skipped: ${stats.placesSkipped}`);
  console.log(`   No coordinates: ${stats.placesNoCoords}`);
  if (stats.placesGeocoded > 0) {
    console.log(`   Geocoded: ${stats.placesGeocoded}`);
  }
  console.log('='.repeat(60));
}

/**
 * Import Pet Inu Yado accommodations
 */
async function importPetInuYadoAccommodations(
  jsonFile: string,
  dryRun: boolean = false
): Promise<void> {
  console.log(`📂 Loading data from ${jsonFile}...`);

  const fileContent = fs.readFileSync(jsonFile, 'utf-8');
  const accommodations: ScrapedPlace[] = JSON.parse(fileContent);

  console.log(`✅ Loaded ${accommodations.length} accommodations`);

  // Get or create category
  const categoryId = await getOrCreateCategory('hotel', 'Hotel', 'ホテル');
  console.log(`✅ Using category ID: ${categoryId}`);

  const stats = {
    placesCreated: 0,
    placesSkipped: 0,
    placesNoCoords: 0,
    placesGeocoded: 0,
  };

  // Geocoding options
  const geocodeOptions: GeocodeOptions = {
    service: (process.env.GEOCODING_SERVICE as any) || 'nominatim',
    apiKey: process.env.GEOCODING_API_KEY,
    delay: 1000,
    countryCode: 'JP',
  };
  const enableGeocoding = process.env.ENABLE_GEOCODING !== 'false';
  
  // Get translation options
  const translationOptions = getTranslationOptions();
  const enableTranslation = translationOptions !== undefined;

  for (let i = 0; i < accommodations.length; i++) {
    const accData = accommodations[i];
    const name = accData.name?.trim();
    if (!name) continue;

    const address = accData.full_address || accData.address || '';

    // Try to get coordinates (from scraped data or geocoding)
    let coords = await ensureCoordinates(accData, enableGeocoding ? geocodeOptions : undefined);
    
    if (!coords) {
      stats.placesNoCoords++;
      if (i < 5) {
        console.log(`  ⏭️  Skipping ${name}: No coordinates (address: ${address || 'N/A'})`);
      }
      continue;
    }

    if (accData.latitude === undefined && coords) {
      stats.placesGeocoded++;
    }

    const lat = coords.lat;
    const lng = coords.lng;

    // Check if already exists
    if (!dryRun && await placeExists(name, categoryId)) {
      stats.placesSkipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  Would create: ${name} (${lat}, ${lng}) - ${address}`);
      stats.placesCreated++;
      continue;
    }

    // Translate if enabled
    let translated: any = {};
    if (enableTranslation && translationOptions) {
      try {
        translated = await translatePlace({
          name: name,
          description: accData.description,
          address: address,
          pet_policy: accData.pet_policy,
        }, translationOptions);
      } catch (error) {
        console.warn(`  ⚠️  Translation failed for ${name}, using Japanese only:`, error);
      }
    }

    // Build contact info and pet policy
    const contact = buildContactInfo(accData);
    const petPolicy = buildPetPolicy(accData);

    // Create place document
    try {
      const placeDoc: any = {
        _type: 'place',
        title: {
          en: translated.name || name,
          ja: name,
        },
        slug: {
          current: generateSlug(name),
          _type: 'slug',
        },
        category: {
          _type: 'reference',
          _ref: categoryId,
        },
        hotelDetails: {
          priceRange: accData.price_range || undefined,
        },
        location: {
          _type: 'geopoint',
          lat: lat,
          lng: lng,
        },
      };

      if (address) {
        placeDoc.address = {
          en: translated.address || undefined,
          ja: address,
          full: address,
        };
      }

      if (accData.area) {
        placeDoc.area = accData.area;
      }

      if (contact) {
        placeDoc.contact = contact;
      }

      if (petPolicy) {
        placeDoc.petFriendlyFeatures = petPolicy;
      }

      if (accData.source) {
        placeDoc.source = accData.source;
      }

      await client.create(placeDoc);
      stats.placesCreated++;

      if ((i + 1) % 10 === 0) {
        console.log(`  Processed ${i + 1}/${accommodations.length}...`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to create ${name}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Statistics:');
  console.log(`   Created: ${stats.placesCreated}`);
  console.log(`   Skipped: ${stats.placesSkipped}`);
  console.log(`   No coordinates: ${stats.placesNoCoords}`);
  if (stats.placesGeocoded > 0) {
    console.log(`   Geocoded: ${stats.placesGeocoded}`);
  }
  console.log('='.repeat(60));
}

/**
 * Import Izu Wanko facilities/attractions
 */
async function importIzuWankoFacilities(
  jsonFile: string,
  dryRun: boolean = false
): Promise<void> {
  console.log(`📂 Loading data from ${jsonFile}...`);

  const fileContent = fs.readFileSync(jsonFile, 'utf-8');
  const facilities: ScrapedPlace[] = JSON.parse(fileContent);

  console.log(`✅ Loaded ${facilities.length} facilities/attractions`);

  const stats = {
    placesCreated: 0,
    placesSkipped: 0,
    placesNoCoords: 0,
    placesGeocoded: 0,
  };

  // Geocoding options
  const geocodeOptions: GeocodeOptions = {
    service: (process.env.GEOCODING_SERVICE as any) || 'nominatim',
    apiKey: process.env.GEOCODING_API_KEY,
    delay: 1000,
    countryCode: 'JP',
  };
  const enableGeocoding = process.env.ENABLE_GEOCODING !== 'false';

  for (let i = 0; i < facilities.length; i++) {
    const facilityData = facilities[i];
    const name = facilityData.name?.trim();
    if (!name) continue;

    const address = facilityData.address || facilityData.full_address || '';

    // Try to get coordinates (from scraped data or geocoding)
    let coords = await ensureCoordinates(facilityData, enableGeocoding ? geocodeOptions : undefined);
    
    if (!coords) {
      stats.placesNoCoords++;
      if (i < 5) {
        console.log(`  ⏭️  Skipping ${name}: No coordinates (address: ${address || 'N/A'})`);
      }
      continue;
    }

    if (facilityData.latitude === undefined && coords) {
      stats.placesGeocoded++;
    }

    const lat = coords.lat;
    const lng = coords.lng;

    // Determine category based on place_type
    const placeType = facilityData.place_type || 'attraction';
    let categorySlug = 'attraction';
    let categoryTitleEn = 'Attraction';
    let categoryTitleJa = 'アトラクション';

    if (placeType === 'museum') {
      categorySlug = 'museum';
      categoryTitleEn = 'Museum';
      categoryTitleJa = '博物館・美術館';
    } else if (placeType === 'park') {
      categorySlug = 'park';
      categoryTitleEn = 'Park';
      categoryTitleJa = '公園';
    } else if (placeType === 'zoo') {
      categorySlug = 'zoo';
      categoryTitleEn = 'Zoo';
      categoryTitleJa = '動物園';
    }

    const categoryId = await getOrCreateCategory(categorySlug, categoryTitleEn, categoryTitleJa);

    // Check if already exists
    if (!dryRun && await placeExists(name, categoryId)) {
      stats.placesSkipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  Would create: ${name} (${lat}, ${lng}) - ${address} [${categorySlug}]`);
      stats.placesCreated++;
      continue;
    }

    // Build description from available fields
    const descParts: string[] = [];
    if (facilityData.description) {
      descParts.push(facilityData.description);
    }
    if (facilityData.pet_policy) {
      descParts.push(`ペット対応: ${facilityData.pet_policy}`);
    }
    if (facilityData.opening_hours) {
      descParts.push(`営業時間: ${facilityData.opening_hours}`);
    }
    if (facilityData.closed_days) {
      descParts.push(`定休日: ${facilityData.closed_days}`);
    }

    // Translate if enabled
    let translated: any = {};
    const translationOptions = getTranslationOptions();
    const enableTranslation = translationOptions !== undefined;
    
    if (enableTranslation && translationOptions) {
      try {
        translated = await translatePlace({
          name: name,
          description: facilityData.description,
          address: address,
          pet_policy: facilityData.pet_policy,
        }, translationOptions);
      } catch (error) {
        console.warn(`  ⚠️  Translation failed for ${name}, using Japanese only:`, error);
      }
    }

    // Build contact info and pet policy
    const contact = buildContactInfo(facilityData);
    const petPolicy = buildPetPolicy(facilityData);

    // Create place document
    try {
      const placeDoc: any = {
        _type: 'place',
        title: {
          en: translated.name || name,
          ja: name,
        },
        slug: {
          current: generateSlug(name),
          _type: 'slug',
        },
        category: {
          _type: 'reference',
          _ref: categoryId,
        },
        location: {
          _type: 'geopoint',
          lat: lat,
          lng: lng,
        },
      };

      if (address) {
        placeDoc.address = {
          en: translated.address || undefined,
          ja: address,
          full: address,
        };
      }

      if (facilityData.opening_hours) {
        placeDoc.openingHours = {
          en: translated.opening_hours || undefined,
          ja: facilityData.opening_hours,
        };
      }

      if (facilityData.closed_days) {
        placeDoc.closedDays = facilityData.closed_days;
      }

      if (contact) {
        placeDoc.contact = contact;
      }

      if (petPolicy) {
        placeDoc.petFriendlyFeatures = petPolicy;
      }

      if (facilityData.source) {
        placeDoc.source = facilityData.source;
      }

      await client.create(placeDoc);
      stats.placesCreated++;

      if ((i + 1) % 10 === 0) {
        console.log(`  Processed ${i + 1}/${facilities.length}...`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to create ${name}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Statistics:');
  console.log(`   Created: ${stats.placesCreated}`);
  console.log(`   Skipped: ${stats.placesSkipped}`);
  console.log(`   No coordinates: ${stats.placesNoCoords}`);
  if (stats.placesGeocoded > 0) {
    console.log(`   Geocoded: ${stats.placesGeocoded}`);
  }
  console.log('='.repeat(60));
}

/**
 * Import Izu Wanko experiences/workshops
 */
async function importIzuWankoExperiences(
  jsonFile: string,
  dryRun: boolean = false
): Promise<void> {
  console.log(`📂 Loading data from ${jsonFile}...`);

  const fileContent = fs.readFileSync(jsonFile, 'utf-8');
  const experiences: ScrapedPlace[] = JSON.parse(fileContent);

  console.log(`✅ Loaded ${experiences.length} workshops/experiences`);

  const stats = {
    placesCreated: 0,
    placesSkipped: 0,
    placesNoCoords: 0,
    placesGeocoded: 0,
  };

  // Geocoding options
  const geocodeOptions: GeocodeOptions = {
    service: (process.env.GEOCODING_SERVICE as any) || 'nominatim',
    apiKey: process.env.GEOCODING_API_KEY,
    delay: 1000,
    countryCode: 'JP',
  };
  const enableGeocoding = process.env.ENABLE_GEOCODING !== 'false';

  for (let i = 0; i < experiences.length; i++) {
    const expData = experiences[i];
    const name = expData.name?.trim();
    if (!name) continue;

    const address = expData.address || expData.full_address || '';

    // Try to get coordinates (from scraped data or geocoding)
    let coords = await ensureCoordinates(expData, enableGeocoding ? geocodeOptions : undefined);
    
    if (!coords) {
      stats.placesNoCoords++;
      if (i < 5) {
        console.log(`  ⏭️  Skipping ${name}: No coordinates (address: ${address || 'N/A'})`);
      }
      continue;
    }

    if (expData.latitude === undefined && coords) {
      stats.placesGeocoded++;
    }

    const lat = coords.lat;
    const lng = coords.lng;

    // Determine category based on place_type
    const placeType = expData.place_type || 'workshop';
    let categorySlug = 'workshop';
    let categoryTitleEn = 'Workshop';
    let categoryTitleJa = '体験工房';

    if (placeType === 'pottery') {
      categorySlug = 'pottery';
      categoryTitleEn = 'Pottery Workshop';
      categoryTitleJa = '陶芸体験';
    } else if (placeType === 'glasswork') {
      categorySlug = 'glasswork';
      categoryTitleEn = 'Glasswork Workshop';
      categoryTitleJa = 'ガラス工房';
    } else if (placeType === 'silversmith') {
      categorySlug = 'silversmith';
      categoryTitleEn = 'Silversmith Workshop';
      categoryTitleJa = '銀細工工房';
    } else if (placeType === 'metalwork') {
      categorySlug = 'metalwork';
      categoryTitleEn = 'Metalwork Workshop';
      categoryTitleJa = '鍛金工房';
    } else if (placeType === 'painting') {
      categorySlug = 'painting';
      categoryTitleEn = 'Painting Workshop';
      categoryTitleJa = '絵付け工房';
    } else if (placeType === 'craft') {
      categorySlug = 'craft';
      categoryTitleEn = 'Craft Workshop';
      categoryTitleJa = 'クラフト工房';
    }

    const categoryId = await getOrCreateCategory(categorySlug, categoryTitleEn, categoryTitleJa);

    // Check if already exists
    if (!dryRun && await placeExists(name, categoryId)) {
      stats.placesSkipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  Would create: ${name} (${lat}, ${lng}) - ${address} [${categorySlug}]`);
      stats.placesCreated++;
      continue;
    }

    // Build description from available fields
    const descParts: string[] = [];
    if (expData.description) {
      descParts.push(expData.description);
    }
    if (expData.pet_policy) {
      descParts.push(`ペット対応: ${expData.pet_policy}`);
    }
    if (expData.opening_hours) {
      descParts.push(`営業時間: ${expData.opening_hours}`);
    }
    if (expData.closed_days) {
      descParts.push(`定休日: ${expData.closed_days}`);
    }

    // Translate if enabled
    let translated: any = {};
    const translationOptions = getTranslationOptions();
    const enableTranslation = translationOptions !== undefined;
    
    if (enableTranslation && translationOptions) {
      try {
        translated = await translatePlace({
          name: name,
          description: expData.description,
          address: address,
          pet_policy: expData.pet_policy,
        }, translationOptions);
      } catch (error) {
        console.warn(`  ⚠️  Translation failed for ${name}, using Japanese only:`, error);
      }
    }

    // Build contact info and pet policy
    const contact = buildContactInfo(expData);
    const petPolicy = buildPetPolicy(expData);

    // Create place document
    try {
      const placeDoc: any = {
        _type: 'place',
        title: {
          en: translated.name || name,
          ja: name,
        },
        slug: {
          current: generateSlug(name),
          _type: 'slug',
        },
        category: {
          _type: 'reference',
          _ref: categoryId,
        },
        location: {
          _type: 'geopoint',
          lat: lat,
          lng: lng,
        },
      };

      if (address) {
        placeDoc.address = {
          en: translated.address || undefined,
          ja: address,
          full: address,
        };
      }

      if (expData.opening_hours) {
        placeDoc.openingHours = {
          en: translated.opening_hours || undefined,
          ja: expData.opening_hours,
        };
      }

      if (expData.closed_days) {
        placeDoc.closedDays = expData.closed_days;
      }

      if (contact) {
        placeDoc.contact = contact;
      }

      if (petPolicy) {
        placeDoc.petFriendlyFeatures = petPolicy;
      }

      if (expData.source) {
        placeDoc.source = expData.source;
      }

      await client.create(placeDoc);
      stats.placesCreated++;

      if ((i + 1) % 10 === 0) {
        console.log(`  Processed ${i + 1}/${experiences.length}...`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to create ${name}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Statistics:');
  console.log(`   Created: ${stats.placesCreated}`);
  console.log(`   Skipped: ${stats.placesSkipped}`);
  console.log(`   No coordinates: ${stats.placesNoCoords}`);
  if (stats.placesGeocoded > 0) {
    console.log(`   Geocoded: ${stats.placesGeocoded}`);
  }
  console.log('='.repeat(60));
}

/**
 * Main import function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: tsx scripts/import/import-to-sanity.ts <json-file> [--type accommodation|restaurant|facility|experience] [--dry-run]');
    process.exit(1);
  }

  const jsonFile = args[0];
  const typeArg = args.find(arg => arg.startsWith('--type='))?.split('=')[1] || 
                  (args.includes('--type') ? args[args.indexOf('--type') + 1] : null);
  const dryRun = args.includes('--dry-run');

  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ File not found: ${jsonFile}`);
    process.exit(1);
  }

  // Auto-detect type from filename if not specified
  let type = typeArg;
  if (!type) {
    const filename = path.basename(jsonFile).toLowerCase();
    if (filename.includes('accommodation') || filename.includes('pet_inu_yado')) {
      type = 'accommodation';
    } else if (filename.includes('restaurant') || (filename.includes('izu_wanko') && !filename.includes('facilities') && !filename.includes('experiences'))) {
      type = 'restaurant';
    } else if (filename.includes('facilities') || filename.includes('shisetsu')) {
      type = 'facility';
    } else if (filename.includes('experiences') || filename.includes('taiken')) {
      type = 'experience';
    } else {
      console.error('⚠️  Could not auto-detect type. Please specify --type=accommodation, --type=restaurant, --type=facility, or --type=experience');
      process.exit(1);
    }
  }

  if (type === 'accommodation') {
    await importPetInuYadoAccommodations(jsonFile, dryRun);
  } else if (type === 'restaurant') {
    await importIzuWankoRestaurants(jsonFile, dryRun);
  } else if (type === 'facility') {
    await importIzuWankoFacilities(jsonFile, dryRun);
  } else if (type === 'experience') {
    await importIzuWankoExperiences(jsonFile, dryRun);
  } else {
    console.error('Invalid type. Use "accommodation", "restaurant", "facility", or "experience"');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });
}

