import type { CollectionConfig } from 'payload'
import { refreshContent, removeContent, staffOnly } from '@/lib/cleanzo-access'

const publicAccess = { read: () => true, create: staffOnly, update: staffOnly, delete: staffOnly }
const hooks = { afterChange: [refreshContent], afterDelete: [removeContent] }

export const RateItems: CollectionConfig = {
  slug: 'rate-items',
  admin: {
    useAsTitle: 'name',
    group: 'Garment care',
    defaultColumns: ['name', 'category', 'price', 'unit'],
  },
  access: publicAccess,
  hooks,
  versions: false,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'name' },
    { name: 'emoji', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['daily', 'men', 'women', 'linens', 'shoes'],
    },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'unit', type: 'select', required: true, options: ['kg', 'each', 'pair'] },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}

export const Services: CollectionConfig = {
  slug: 'care-services',
  admin: { useAsTitle: 'title', group: 'Garment care' },
  access: publicAccess,
  hooks,
  versions: false,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    { name: 'emoji', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'priceLabel', type: 'text', required: true },
    { name: 'unitLabel', type: 'text', required: true },
    { name: 'badge', type: 'text' },
    { name: 'rateItem', type: 'relationship', relationTo: 'rate-items', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

export const Team: CollectionConfig = {
  slug: 'leadership',
  admin: { useAsTitle: 'name', group: 'Website content' },
  access: publicAccess,
  hooks,
  versions: false,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'name' },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea', required: true },
    { name: 'portrait', type: 'upload', relationTo: 'media', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

export const Questions: CollectionConfig = {
  slug: 'care-faqs',
  admin: { useAsTitle: 'question', group: 'Website content' },
  access: publicAccess,
  hooks,
  versions: false,
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
