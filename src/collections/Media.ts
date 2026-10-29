import type { CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'
import { refreshContent, removeContent } from '@/lib/cleanzo-access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
      return headers
    },
  },
  hooks: { afterChange: [refreshContent], afterDelete: [removeContent] },
}
