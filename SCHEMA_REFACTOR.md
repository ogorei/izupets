# Sanity Schema Refactor: Places → Place (Compositional Model)

## Overview

This document describes the architectural refactoring of the Sanity schema from a monolithic `places` design to a compositional `place` model.

## Key Changes

### 1. Schema Renaming
- **Before**: `places` (plural, monolithic)
- **After**: `place` (singular, compositional)

### 2. Category System
- **Before**: Hardcoded `placeType` enum (restaurant, hotel, cafe, etc.)
- **After**: `placeCategory` document type with reference relationship
  - Categories are now managed in Sanity Studio
  - No code changes needed to add new categories
  - Categories have localized titles and descriptions

### 3. Shared Objects (Composition)
- **`contactInfo`**: Reusable contact information object
- **`petPolicy`**: Reusable pet-friendly features object
- Both extracted to `sanity/schemas/shared/` to avoid duplication

### 4. Category-Specific Fields
- **`hotelDetails`**: Hotel-specific fields (check-in/out, room types, etc.)
- **`restaurantDetails`**: Restaurant-specific fields (cuisine, pet menu, etc.)
- Located in `sanity/schemas/categories/`
- Fields are clearly labeled as category-specific
- Future enhancement: Can implement custom input component for conditional display

## File Structure

```
sanity/schemas/
├── place.ts                    # Main place schema (replaces places.ts)
├── placeCategory.ts            # New category document type
├── shared/
│   ├── contactInfo.ts          # Reusable contact object
│   ├── petPolicy.ts            # Reusable pet policy object
│   └── conditionalFields.ts   # Helper utilities (for future use)
└── categories/
    ├── hotelDetails.ts          # Hotel-specific fields
    └── restaurantDetails.ts      # Restaurant-specific fields
```

## Schema Changes

### Place Schema (`place.ts`)
- Renamed from `places` to `place`
- Replaced `placeType: string` enum with `category: reference` to `placeCategory`
- Uses shared objects: `contactInfo`, `petPolicy`
- Includes category-specific objects: `hotelDetails`, `restaurantDetails`
- All shared fields preserved (images, address, hours, rating, etc.)

### Place Category Schema (`placeCategory.ts`)
- New document type for managing place categories
- Fields: `title` (en/ja), `slug`, `description` (en/ja)
- Replaces hardcoded enum values

## Query Updates

### GROQ Queries (`sanity/lib/queries.ts`)
All queries updated to:
- Use `_type == "place"` instead of `_type == "places"`
- Dereference category: `category->{...}`
- Include `categorySlug` for backward compatibility
- Include category-specific fields: `hotelDetails`, `restaurantDetails`

### Updated Queries
- `placesQuery`: Fetches all places with category dereferenced
- `placeQuery`: Fetches single place by slug with category dereferenced
- `featuredPlacesQuery`: Fetches featured places with category dereferenced
- `placeCategoryListQuery`: New query to fetch all place categories

## TypeScript Types

### Updated Types (`src/types.ts`)
- Added `PlaceCategory` type
- Added `HotelDetails` type
- Added `RestaurantDetails` type
- Updated `PetFriendlyLocation`:
  - Added `category?: PlaceCategory`
  - Added `categorySlug?: string` (for backward compatibility)
  - Kept `placeType?: string` (legacy, for migration period)
  - Added `hotelDetails?: HotelDetails`
  - Added `restaurantDetails?: RestaurantDetails`

## Backward Compatibility

The refactor maintains backward compatibility through:
1. **GROQ queries** include `categorySlug` which can replace `placeType` in frontend code
2. **TypeScript types** include both `category` and legacy `placeType` fields
3. **Frontend migration path**: Code can gradually migrate from `placeType` to `categorySlug` or `category.slug.current`

## Frontend Migration Notes

### Before (Old Schema)
```typescript
place.placeType // "restaurant" | "hotel" | "cafe" | ...
```

### After (New Schema)
```typescript
// Option 1: Use categorySlug (drop-in replacement)
place.categorySlug // "restaurant" | "hotel" | "cafe" | ...

// Option 2: Use full category object
place.category.slug.current // "restaurant" | "hotel" | "cafe" | ...
place.category.title.en // "Restaurant" | "Hotel" | "Cafe" | ...
```

### Recommended Migration Steps
1. Update code to use `categorySlug` instead of `placeType` (simple string replacement)
2. Gradually migrate to use full `category` object for richer data
3. Remove `placeType` references once migration is complete

## Sanity Studio Updates

### Desk Structure (`sanity/deskStructure/index.ts`)
- Updated to use `place` schema type
- Added `placeCategory` document type list item
- Filter queries updated to `_type == "place"`

## Benefits of New Architecture

1. **Flexibility**: Categories managed in Studio, no code changes needed
2. **Composability**: Shared objects prevent duplication
3. **Scalability**: Easy to add new category-specific fields
4. **Type Safety**: Better TypeScript support with structured category data
5. **Localization**: Categories support en/ja localization
6. **Maintainability**: Clear separation of concerns

## Future Enhancements

1. **Conditional Field Display**: Implement custom input component to conditionally show/hide category-specific fields based on selected category
2. **Additional Category Types**: Add more category-specific detail objects (cafeDetails, parkDetails, etc.)
3. **Category Validation**: Add validation to ensure category-specific fields are only filled for matching categories

## Breaking Changes

⚠️ **Note**: This is a breaking change for Sanity Studio. Existing documents with `placeType` will need to:
1. Create corresponding `placeCategory` documents
2. Update `place` documents to reference the new categories
3. Consider a migration script for existing data

The frontend can continue working during migration by using the `categorySlug` field which provides backward compatibility.


