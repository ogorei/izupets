// English to Japanese mapping
export const category_jp: { [key: string]: string } = {
  "natural": "ナチュラル",
  "skin": "素肌",
  "beautiful-skin": "美肌",
  "moisture": "保湿",
  "face-wash": "洗顔",
  "skin-barrier": "角質",
  "pores": "毛穴",
  "uv": "日焼け",
  "lotion": "化粧水",
  "serum": "美容液",
  "spot": "シミ",
  "skin-tone": "くすみ",
  "tightness": "ハリ",
  "balance": "弾力",
  "glow": "ツヤ",
  "sensitive-skin": "敏感肌",
  "dry-skin": "乾燥肌",
  "oily-skin": "脂性肌",
  "mix-skin": "混合肌",
  "acne": "ニキビ",
  "aging-care": "シワ",
  "organic": "オーガニック",
  "handmade": "手作り",
  "whitening": "美白",
  "skincare": "スキンケア",
  "soap": "石鹸",
  "scalp": "頭皮ケア",
  "skin-care": "スキンケア",
  "hair-care": "ヘアケア",
  "perfume": "香水",
};

// Create reverse mapping: Japanese → English
export const category_en: { [key: string]: string } = Object.entries(category_jp).reduce(
  (acc, [en, jp]) => ({ ...acc, [jp]: en }),
  {}
);

// Fixed translation function
export const translateCategory = (name: string, locale: string): string => {
  if (locale === "ja") {
    return category_jp[name] || name;
  } else if (locale === "en") {
    // If it's already an English key, return as-is
    if (Object.prototype.hasOwnProperty.call(category_jp, name)) {
      return name;
    }
    // Try to translate Japanese back to English
    return category_en[name] || name;
  }
  return name;
};
