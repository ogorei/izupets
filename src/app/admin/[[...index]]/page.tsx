'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../config';

export default function AdminPage() {
  // check and config is been passed
  return <NextStudio config={config} />
}