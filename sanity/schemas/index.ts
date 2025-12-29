import {eventType} from "./eventType"
import {authorType} from "./authorType"
import { categoryType } from './categoryType'
import { properties } from "./properties"
import { place } from "./place"

/**
 * Schema Types Export
 * 
 * Updated to reflect the refactored schema structure:
 * - places → place (renamed for semantic clarity)
 * - Added placeCategory (new document type for managing place categories)
 * 
 * The old "places" schema has been replaced with the compositional "place" schema.
 */
export const schemaTypes = [
  eventType, 
  authorType, 
  categoryType, 
  properties, 
  place,
]