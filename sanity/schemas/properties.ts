import {defineField, defineType} from 'sanity'
// ペットフレンドリー施設特性評価

export const properties = defineType({
  name: 'properties',
  title: 'Properties',
  description: 'ペットフレンドリー施設特性（Rule:必ず評価項目を書き込む）',
  type: 'document',
  fields: [
    // Outdoor and Space Features
    defineField({
      name: 'outdoorSpace',
      type: 'boolean',
      title: 'Outdoor Space (屋外スペース)',
    }),
    defineField({
      name: 'outdoorSeating',
      type: 'boolean',
      title: 'Outdoor Seating (屋外席)',
    }),
    defineField({
      name: 'gardenArea',
      type: 'boolean',
      title: 'Garden Area (ガーデンエリア)',
    }),
    defineField({
      name: 'terrace',
      type: 'boolean',
      title: 'Terrace (テラス)',
    }),
    defineField({
      name: 'balcony',
      type: 'boolean',
      title: 'Balcony (バルコニー)',
    }),
    defineField({
      name: 'rooftop',
      type: 'boolean',
      title: 'Rooftop Access (屋上利用)',
    }),

    // Pet-Specific Amenities
    defineField({
      name: 'petWaterBowl',
      type: 'boolean',
      title: 'Pet Water Bowl (ペット用給水ボウル)',
    }),
    defineField({
      name: 'petTreats',
      type: 'boolean',
      title: 'Pet Treats (ペット用おやつ)',
    }),
    defineField({
      name: 'petMenu',
      type: 'boolean',
      title: 'Pet Menu (ペット用メニュー)',
    }),
    defineField({
      name: 'petToys',
      type: 'boolean',
      title: 'Pet Toys (ペット用おもちゃ)',
    }),
    defineField({
      name: 'petBedding',
      type: 'boolean',
      title: 'Pet Bedding (ペット用ベッド)',
    }),
    defineField({
      name: 'petCleaningSupplies',
      type: 'boolean',
      title: 'Pet Cleaning Supplies (ペット用清掃用品)',
    }),
    defineField({
      name: 'petWasteDisposal',
      type: 'boolean',
      title: 'Pet Waste Disposal (ペット用排泄物処理)',
    }),
    defineField({
      name: 'petShower',
      type: 'boolean',
      title: 'Pet Shower (ペット用シャワー)',
    }),
    defineField({
      name: 'petGrooming',
      type: 'boolean',
      title: 'Pet Grooming (ペット用グルーミング)',
    }),

    // Furniture and Seating Rules
    defineField({
      name: 'furnitureRulesRelaxed',
      type: 'boolean',
      title: 'Furniture Rules Relaxed (家具ルール緩和)',
    }),
    defineField({
      name: 'petsAllowedOnFurniture',
      type: 'boolean',
      title: 'Pets Allowed on Furniture (家具上でのペット許可)',
    }),
    defineField({
      name: 'petFriendlySeating',
      type: 'boolean',
      title: 'Pet-Friendly Seating (ペットフレンドリー席)',
    }),
    defineField({
      name: 'designatedPetAreas',
      type: 'boolean',
      title: 'Designated Pet Areas (ペット専用エリア)',
    }),

    // Pet Size and Type Restrictions
    defineField({
      name: 'smallPetsOnly',
      type: 'boolean',
      title: 'Small Pets Only (小型ペットのみ)',
    }),
    defineField({
      name: 'mediumPetsAllowed',
      type: 'boolean',
      title: 'Medium Pets Allowed (中型ペット許可)',
    }),
    defineField({
      name: 'largePetsAllowed',
      type: 'boolean',
      title: 'Large Pets Allowed (大型ペット許可)',
    }),
    defineField({
      name: 'dogsOnly',
      type: 'boolean',
      title: 'Dogs Only (犬のみ)',
    }),
    defineField({
      name: 'catsAllowed',
      type: 'boolean',
      title: 'Cats Allowed (猫許可)',
    }),
    defineField({
      name: 'otherPetsAllowed',
      type: 'boolean',
      title: 'Other Pets Allowed (その他ペット許可)',
    }),

    // Pet Behavior Requirements
    defineField({
      name: 'leashRequired',
      type: 'boolean',
      title: 'Leash Required (リード必須)',
    }),
    defineField({
      name: 'wellBehavedPets',
      type: 'boolean',
      title: 'Well-Behaved Pets Only (おとなしいペットのみ)',
    }),
    defineField({
      name: 'vaccinationRequired',
      type: 'boolean',
      title: 'Vaccination Required (予防接種必須)',
    }),
    defineField({
      name: 'petRegistration',
      type: 'boolean',
      title: 'Pet Registration Required (ペット登録必須)',
    }),

    // Additional Services
    defineField({
      name: 'petSitting',
      type: 'boolean',
      title: 'Pet Sitting Service (ペットシッターサービス)',
    }),
    defineField({
      name: 'petWalking',
      type: 'boolean',
      title: 'Pet Walking Service (ペット散歩サービス)',
    }),
    defineField({
      name: 'petPhotography',
      type: 'boolean',
      title: 'Pet Photography (ペット撮影)',
    }),
    defineField({
      name: 'petEvents',
      type: 'boolean',
      title: 'Pet Events (ペットイベント)',
    }),
    defineField({
      name: 'petTraining',
      type: 'boolean',
      title: 'Pet Training (ペットトレーニング)',
    }),

    // Accessibility and Safety
    defineField({
      name: 'petFirstAid',
      type: 'boolean',
      title: 'Pet First Aid Available (ペット救急対応)',
    }),
    defineField({
      name: 'emergencyVetNearby',
      type: 'boolean',
      title: 'Emergency Vet Nearby (緊急獣医近隣)',
    }),
    defineField({
      name: 'petInsuranceAccepted',
      type: 'boolean',
      title: 'Pet Insurance Accepted (ペット保険対応)',
    }),
    defineField({
      name: 'wheelchairAccessible',
      type: 'boolean',
      title: 'Wheelchair Accessible (車椅子対応)',
    }),
  ],
});
