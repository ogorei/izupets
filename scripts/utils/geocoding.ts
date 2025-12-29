/**
 * Geocoding Utility
 * 
 * Provides geocoding functionality to convert addresses to coordinates.
 * Uses OpenStreetMap Nominatim API (free, no API key required).
 * Can be extended to support other geocoding services.
 */

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
  confidence?: number;
}

export interface GeocodeOptions {
  service?: 'nominatim' | 'google' | 'mapbox';
  apiKey?: string;
  delay?: number; // Delay between requests in ms (for rate limiting)
  countryCode?: string; // ISO country code (e.g., 'JP' for Japan)
}

/**
 * Geocode an address using OpenStreetMap Nominatim
 * 
 * @param address - Address string to geocode
 * @param options - Geocoding options
 * @returns GeocodeResult or null if geocoding fails
 */
export async function geocodeAddress(
  address: string,
  options: GeocodeOptions = {}
): Promise<GeocodeResult | null> {
  if (!address || address.trim().length === 0) {
    return null;
  }

  const {
    service = 'nominatim',
    delay = 1000, // 1 second delay for Nominatim rate limiting
    countryCode = 'JP', // Default to Japan
  } = options;

  // Add delay for rate limiting (Nominatim requires max 1 request per second)
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  try {
    switch (service) {
      case 'nominatim':
        return await geocodeWithNominatim(address, countryCode);
      case 'google':
        return await geocodeWithGoogle(address, options.apiKey);
      case 'mapbox':
        return await geocodeWithMapbox(address, options.apiKey);
      default:
        console.warn(`Unknown geocoding service: ${service}, falling back to Nominatim`);
        return await geocodeWithNominatim(address, countryCode);
    }
  } catch (error) {
    console.warn(`Geocoding failed for "${address}":`, error);
    return null;
  }
}

/**
 * Geocode using OpenStreetMap Nominatim (free, no API key required)
 */
async function geocodeWithNominatim(
  address: string,
  countryCode: string = 'JP'
): Promise<GeocodeResult | null> {
  // Construct the API URL
  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&countrycodes=${countryCode}&limit=1&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Pet-Friendly Places Scraper (contact@example.com)', // Nominatim requires User-Agent
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    // Validate coordinates are in Japan (or reasonable bounds)
    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    // Validate coordinates are reasonable for Japan
    if (countryCode === 'JP' && (lat < 24 || lat > 46 || lng < 123 || lng > 146)) {
      console.warn(`Coordinates (${lat}, ${lng}) are outside Japan bounds for address: ${address}`);
      // Still return them, but log a warning
    }

    return {
      latitude: lat,
      longitude: lng,
      formattedAddress: result.display_name,
      confidence: result.importance ? Math.min(result.importance * 10, 100) : undefined,
    };
  } catch (error) {
    throw new Error(`Nominatim geocoding failed: ${error}`);
  }
}

/**
 * Geocode using Google Geocoding API (requires API key)
 */
async function geocodeWithGoogle(
  address: string,
  apiKey?: string
): Promise<GeocodeResult | null> {
  if (!apiKey) {
    throw new Error('Google Geocoding API requires an API key');
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&region=jp`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    const location = result.geometry.location;

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    throw new Error(`Google geocoding failed: ${error}`);
  }
}

/**
 * Geocode using Mapbox Geocoding API (requires API key)
 */
async function geocodeWithMapbox(
  address: string,
  apiKey?: string
): Promise<GeocodeResult | null> {
  if (!apiKey) {
    throw new Error('Mapbox Geocoding API requires an API key');
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}&country=JP&limit=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mapbox Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];
    const [lng, lat] = feature.center;

    return {
      latitude: lat,
      longitude: lng,
      formattedAddress: feature.place_name,
      confidence: feature.relevance ? feature.relevance * 100 : undefined,
    };
  } catch (error) {
    throw new Error(`Mapbox geocoding failed: ${error}`);
  }
}

/**
 * Batch geocode multiple addresses with rate limiting
 * 
 * @param addresses - Array of addresses to geocode
 * @param options - Geocoding options
 * @returns Array of GeocodeResult (null for failed geocoding)
 */
export async function geocodeAddresses(
  addresses: string[],
  options: GeocodeOptions = {}
): Promise<(GeocodeResult | null)[]> {
  const results: (GeocodeResult | null)[] = [];
  const delay = options.delay || 1000; // Default 1 second delay for Nominatim

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const result = await geocodeAddress(address, { ...options, delay: i === 0 ? 0 : delay });
    results.push(result);

    // Log progress
    if ((i + 1) % 10 === 0) {
      console.log(`  Geocoded ${i + 1}/${addresses.length} addresses...`);
    }
  }

  return results;
}

