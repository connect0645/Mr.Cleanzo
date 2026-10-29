import type { GlobalConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { staffOnly } from '@/lib/cleanzo-access'

export const Brand: GlobalConfig = {
  slug: 'cleanzo-brand',
  label: 'Brand & contact',
  access: { read: () => true, update: staffOnly },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'openingDate', type: 'date' },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag('cleanzo-content', { expire: 0 })
          revalidatePath('/')
        } catch (error) {
          if (
            !(
              error instanceof Error &&
              /static generation store|incrementalCache|request store/i.test(error.message)
            )
          )
            throw error
        }
        return doc
      },
    ],
  },
}
