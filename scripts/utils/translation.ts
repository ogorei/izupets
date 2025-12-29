/**
 * Translation Utility
 * 
 * Provides translation functionality to convert Japanese text to English.
 * Supports multiple translation services: Google Translate, DeepL, etc.
 * Can be extended to support other translation services.
 */

export interface TranslationOptions {
  service?: 'google' | 'deepl' | 'openai';
  apiKey?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  delay?: number; // Delay between requests in ms (for rate limiting)
}

/**
 * Translate text from Japanese to English
 * 
 * @param text - Text to translate
 * @param options - Translation options
 * @returns Translated text or null if translation fails
 */
export async function translateText(
  text: string,
  options: TranslationOptions = {}
): Promise<string | null> {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const {
    service = 'google',
    sourceLanguage = 'ja',
    targetLanguage = 'en',
    delay = 0,
  } = options;

  // Add delay for rate limiting
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // If source and target are the same, return original
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  try {
    switch (service) {
      case 'google':
        return await translateWithGoogle(text, sourceLanguage, targetLanguage, options.apiKey);
      case 'deepl':
        return await translateWithDeepL(text, sourceLanguage, targetLanguage, options.apiKey);
      case 'openai':
        return await translateWithOpenAI(text, sourceLanguage, targetLanguage, options.apiKey);
      default:
        console.warn(`Unknown translation service: ${service}, falling back to Google`);
        return await translateWithGoogle(text, sourceLanguage, targetLanguage, options.apiKey);
    }
  } catch (error) {
    console.warn(`Translation failed for "${text.substring(0, 50)}...":`, error);
    return null;
  }
}

/**
 * Translate using Google Translate API
 */
async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey?: string
): Promise<string | null> {
  if (!apiKey) {
    // Try using the free Google Translate endpoint (less reliable, may have rate limits)
    return await translateWithGoogleFree(text, sourceLang, targetLang);
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.translations?.[0]?.translatedText || null;
  } catch (error) {
    throw new Error(`Google translation failed: ${error}`);
  }
}

/**
 * Translate using Google Translate free endpoint (no API key, but less reliable)
 */
async function translateWithGoogleFree(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string | null> {
  // Note: This is a simplified approach. For production, use the official API.
  // This endpoint may have rate limits and may not always work.
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Translate free endpoint error: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.[0]?.[0] || null;
  } catch (error) {
    throw new Error(`Google free translation failed: ${error}`);
  }
}

/**
 * Translate using DeepL API
 */
async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey?: string
): Promise<string | null> {
  if (!apiKey) {
    throw new Error('DeepL API requires an API key');
  }

  // DeepL uses different language codes
  const deeplSourceLang = sourceLang === 'ja' ? 'JA' : sourceLang.toUpperCase();
  const deeplTargetLang = targetLang === 'en' ? 'EN-US' : targetLang.toUpperCase();

  const url = 'https://api-free.deepl.com/v2/translate';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        source_lang: deeplSourceLang,
        target_lang: deeplTargetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translations?.[0]?.text || null;
  } catch (error) {
    throw new Error(`DeepL translation failed: ${error}`);
  }
}

/**
 * Translate using OpenAI API (GPT)
 */
async function translateWithOpenAI(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey?: string
): Promise<string | null> {
  if (!apiKey) {
    throw new Error('OpenAI API requires an API key');
  }

  const url = 'https://api.openai.com/v1/chat/completions';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. Only return the translation, no explanations.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    throw new Error(`OpenAI translation failed: ${error}`);
  }
}

/**
 * Batch translate multiple texts with rate limiting
 * 
 * @param texts - Array of texts to translate
 * @param options - Translation options
 * @returns Array of translated texts (null for failed translations)
 */
export async function translateTexts(
  texts: string[],
  options: TranslationOptions = {}
): Promise<(string | null)[]> {
  const results: (string | null)[] = [];
  const delay = options.delay || 100; // Default 100ms delay

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    const result = await translateText(text, { ...options, delay: i === 0 ? 0 : delay });
    results.push(result);

    // Log progress
    if ((i + 1) % 10 === 0) {
      console.log(`  Translated ${i + 1}/${texts.length} texts...`);
    }
  }

  return results;
}

/**
 * Translate a place object (name, description, etc.)
 */
export async function translatePlace(
  place: {
    name?: string;
    description?: string;
    address?: string;
    pet_policy?: string;
    opening_hours?: string;
    closed_days?: string;
  },
  options: TranslationOptions = {}
): Promise<{
  name?: string;
  description?: string;
  address?: string;
  pet_policy?: string;
  opening_hours?: string;
  closed_days?: string;
}> {
  const translated: any = {};

  if (place.name) {
    translated.name = await translateText(place.name, options);
  }
  if (place.description) {
    translated.description = await translateText(place.description, options);
  }
  if (place.address) {
    // Addresses often don't need translation, but we can try
    translated.address = await translateText(place.address, options);
  }
  if (place.pet_policy) {
    translated.pet_policy = await translateText(place.pet_policy, options);
  }
  if (place.opening_hours) {
    // Opening hours format is usually the same, but we can translate labels
    translated.opening_hours = await translateText(place.opening_hours, options);
  }
  if (place.closed_days) {
    translated.closed_days = await translateText(place.closed_days, options);
  }

  return translated;
}

