import { defineType, defineField} from "sanity";

export const petFriendlyLocation = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Name',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Name',
        }
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name.en'},
      validation: (rule) => rule
      .required()
      .error(`ウェブサイト上商品の個別ページを生成するために必要だよん`),
    }),
    defineField({
      name: 'brand',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Brand',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Brand',
        }
      ],
      validation: (rule) => rule
      .required()
      .error(`ブランド名`),
    }),
    defineField({
      name: 'price',
      type: 'object',
      title: '価格',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Price',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Price',
        }
      ],
      validation: (rule) => rule.required().error('価格を入力してください'),
    }),
    
    defineField({
      name: 'volume',
      type: 'object',
      title: '内容量',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Volume',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Volume',
        }
      ],
      validation: (rule) => rule.required().error('内容量を入力してください'),
    }),
    
    defineField({
      name: 'costPerUsage',
      type: 'object',
      title: '1回あたりの使用コスト',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Cost Per Usage',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Cost Per Usage',
        }
      ],
      validation: (rule) => rule.required().error('1回あたりの使用コストを入力してください'),
    }),
    
    defineField({
      name: 'producedCountry',
      type: 'object',
      title: '製造国',
      fields: [
        {
          name: 'en',
          type: 'string',
          title: 'English Country',
        },
        {
          name: 'ja',
          type: 'string',
          title: 'Japanese Country',
        }
      ],
      validation: (rule) => rule.required().error('製造国を入力してください'),
    }),
    defineField({
      name: 'criteria',
      type: 'reference',
      description: '製品評価（５段階評価）',
      to: [{ type: 'criteria' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'properties',
      type: 'reference',
      description: '製品特性',
      to: [{ type: 'properties' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      type: 'reference',
      description: 'この記事はどのカテゴリーに収納するのかを選択する',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      description:'プロダクトの画像',
    }),
    defineField({
      name: 'description',
      description:'プロダクトの詳細をここに書き込む（文字のみ）',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'array',
          of: [{type: 'block'}],
          title: 'English Description',
        },
        {
          name: 'ja',
          type: 'array',
          of: [{type: 'block'}],
          title: 'Japanese Description',
        }
      ],
    }),
    defineField({
      name: 'body',
      description:'記事の詳細をここに書き込む（文字のみ）',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'array',
          of: [{type: 'block'}],
          title: 'English Body',
        },
        {
          name: 'ja',
          type: 'array',
          of: [{type: 'block'}],
          title: 'Japanese Body',
        }
      ],
    }),
    defineField({
      name: 'ingredients',
      description:'全成分をここに書き込む（文字のみ）',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'array',
          of: [{type: 'block'}],
          title: 'English ingredients',
        },
        {
          name: 'ja',
          type: 'array',
          of: [{type: 'block'}],
          title: 'Japanese ingredients',
        }
      ],
    }),
    defineField({
      name: 'url',
      type: 'url',
    }),
  ],
})
