import { PetActivityType } from '../../types';
import categoriesEn from '../../data/categories-en.json';

export function getHardcodedCategories(): PetActivityType[] {
  return categoriesEn as PetActivityType[];
}

export function getCategoriesByLocale(locale: 'en' | 'ja'): PetActivityType[] {
  const categories = getHardcodedCategories();
  
  // For now, we're using the same JSON file since it contains both languages
  // In the future, you could create separate files for each locale
  return categories;
} 