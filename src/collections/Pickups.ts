import { APIError, type CollectionConfig } from 'payload'
import { staffOnly } from '@/lib/cleanzo-access'

export const Pickups: CollectionConfig = {
  slug: 'pickup-requests',
  admin: {
    useAsTitle: 'customerName',
    group: 'Operations',
    defaultColumns: ['customerName', 'phone', 'pickupDate', 'status'],
  },
  access: { create: () => true, read: staffOnly, update: staffOnly, delete: staffOnly },
  versions: false,
  fields: [
    { name: 'customerName', type: 'text', required: true, minLength: 2, maxLength: 100 },
    {
      name: 'phone',
      type: 'text',
      required: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[6-9]\d{9}$/.test(value)) ||
        'Enter a valid 10-digit Indian mobile number.',
    },
    {
      name: 'pincode',
      type: 'text',
      required: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[1-9]\d{5}$/.test(value)) ||
        'Enter a valid 6-digit pincode.',
    },
    { name: 'address', type: 'textarea', required: true, minLength: 10, maxLength: 500 },
    { name: 'pickupDate', type: 'date', required: true },
    {
      name: 'timeWindow',
      type: 'select',
      required: true,
      options: ['morning', 'afternoon', 'evening'],
    },
    { name: 'notes', type: 'textarea', maxLength: 1000 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'requested',
      required: true,
      options: ['requested', 'confirmed', 'collected', 'completed', 'cancelled'],
      access: {
        create: ({ req }) => req.user?.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
    },
    {
      name: 'estimatedSubtotal',
      type: 'number',
      admin: { readOnly: true },
      access: { create: () => false, update: () => false },
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 30,
      fields: [
        { name: 'rateItem', type: 'relationship', relationTo: 'rate-items', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1, max: 99 },
        {
          name: 'unitPrice',
          type: 'number',
          admin: { readOnly: true },
          access: { create: () => false, update: () => false },
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data && operation === 'create') data.status = 'requested'
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (operation === 'create') {
          const date = new Date(data.pickupDate)
          const today = new Date()
          today.setUTCHours(0, 0, 0, 0)
          if (
            !Number.isFinite(date.getTime()) ||
            date < today ||
            date.getTime() > Date.now() + 31 * 86400000
          )
            throw new APIError('Choose a pickup date within the next 30 days.', 400)
        }
        if (operation === 'create' || data.items) {
          const items = data.items ?? originalDoc?.items ?? []
          let subtotal = 0
          const seen = new Set<string>()
          for (const item of items) {
            const id = typeof item.rateItem === 'object' ? item.rateItem.id : item.rateItem
            if (
              !Number.isInteger(item.quantity) ||
              item.quantity < 1 ||
              item.quantity > 99 ||
              seen.has(String(id))
            )
              throw new APIError('Invalid or duplicate garment quantity.', 400)
            seen.add(String(id))
            const rate = await req.payload.findByID({
              collection: 'rate-items',
              id,
              req,
              overrideAccess: false,
              user: req.user,
              depth: 0,
            })
            if (!rate.active)
              throw new APIError('A selected service is currently unavailable.', 400)
            item.unitPrice = rate.price
            subtotal += rate.price * item.quantity
          }
          data.items = items
          data.estimatedSubtotal = subtotal
        }
        return data
      },
    ],
  },
}
