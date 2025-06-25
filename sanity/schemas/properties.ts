import {defineField, defineType} from 'sanity'
// 製品特性評価

export const properties = defineType({
  name: 'properties',
  title: 'Product Properties',
  description: '製品特性（Rule:必ず評価項目を書き込む）',
  type: 'document',
  fields: [
    defineField({
      name: 'coolingEffect',
      type: 'boolean',
      title: 'Cooling Effect (冷感)',
    }),
    defineField({
      name: 'type',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Foaming Type (泡立ちタイプ)',
    }),
    defineField({
      name: 'aspect',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Product Aspect (製品の見た目)',
    }),
    defineField({
      name: 'transparency',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Product Transparency (透明度)',
    }),
    defineField({
      name: 'pH',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Product pH (製品のpH)',
    }),
    // Boolean type fields(ありなし)
    defineField({
      name: 'refillAvailability',
      type: 'boolean',
      title: 'Refill Availability (詰め替えの可否)',
    }),
    defineField({
      name: 'brandRemovingMakeup',
      type: 'boolean',
      title: 'Removing Makeup (メイク落とし機能)',
    }),
    defineField({
      name: 'parabenFree',
      type: 'boolean',
      title: 'Paraben-Free (パラベン不使用)',
    }),
    defineField({
      name: 'sulfateFree',
      type: 'boolean',
      title: 'Sulfate-Free (硫酸塩不使用)',
    }),
    defineField({
      name: 'siliconeFree',
      type: 'boolean',
      title: 'Silicone-Free (シリコーン不使用)',
    }),
    defineField({
      name: 'fragranceFree',
      type: 'boolean',
      title: 'Fragrance-Free (香り)',
    }),
    defineField({
      name: 'alcoholFree',
      type: 'boolean',
      title: 'Alcohol-Free (アルコール不使用)',
    }),
    defineField({
      name: 'mineralOilFree',
      type: 'boolean',
      title: 'Mineral Oil-Free (ミネラルオイル不使用)',
    }),
    defineField({
      name: 'allergenFree',
      type: 'boolean',
      title: 'Allergen-Free (アレルゲンフリー)',
    }),
    defineField({
      name: 'nonComedogenic',
      type: 'boolean',
      title: 'Non-Comedogenic (ノンコメドジェニック)',
    }),
    defineField({
      name: 'needForTools',
      type: 'boolean',
      title: 'Need for Tools (ツールの必要性)',
    }),
    defineField({
      name: 'suitableForDrySkin',
      type: 'boolean',
      title: 'Suitable for Dry Skin (乾燥肌向け)',
    }),
    defineField({
      name: 'suitableForOilySkin',
      type: 'boolean',
      title: 'Suitable for Oily Skin (脂性肌向け)',
    }),
    defineField({
      name: 'suitableForCombinationSkin',
      type: 'boolean',
      title: 'Suitable for Combination Skin (混合肌向け)',
    }),
    defineField({
      name: 'suitableForSensitiveSkin',
      type: 'boolean',
      title: 'Suitable for Sensitive Skin (敏感肌向け)',
    }),
    defineField({
      name: 'suitableForNormalSkin',
      type: 'boolean',
      title: 'Suitable for Normal Skin (普通肌向け)',
    }),
    defineField({
      name: 'suitableForAcneProneSkin',
      type: 'boolean',
      title: 'Suitable for Acne-Prone Skin (ニキビ肌向け)',
    }),
    defineField({
      name: 'suitableForAgingSkin',
      type: 'boolean',
      title: 'Suitable for Aging Skin (エイジング肌向け)',
    }),
    defineField({
      name: 'scrub',
      type: 'boolean',
      title: 'Contains Scrub (スクラブ入り)',
    }),
  ],
});
