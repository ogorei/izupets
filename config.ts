import { defineConfig } from "sanity";
import { schemaTypes } from './sanity/schemas/index'
import {visionTool} from '@sanity/vision'
import { structure } from './sanity/deskStructure/index'
import { structureTool } from 'sanity/structure';

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  title: 'Lareine',
  apiVersion: '2025-01-20',
  basePath: '/admin',
  plugins: [
    structureTool({
      structure,
    }),
    visionTool({
      defaultApiVersion: 'v2021-03-25',
      defaultDataset: 'production',
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});


export default config