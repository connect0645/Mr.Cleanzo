import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getCleanzoContent = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [services, rates, team, faqs, brand] = await Promise.all([
      payload.find({
        collection: 'care-services',
        overrideAccess: false,
        limit: 30,
        sort: 'order',
        depth: 0,
      }),
      payload.find({
        collection: 'rate-items',
        overrideAccess: false,
        where: { active: { equals: true } },
        limit: 100,
        sort: 'order',
        depth: 0,
      }),
      payload.find({
        collection: 'leadership',
        overrideAccess: false,
        limit: 20,
        sort: 'order',
        depth: 1,
      }),
      payload.find({
        collection: 'care-faqs',
        overrideAccess: false,
        limit: 30,
        sort: 'order',
        depth: 0,
      }),
      payload.findGlobal({ slug: 'cleanzo-brand', overrideAccess: false, depth: 1 }),
    ])
    return { services: services.docs, rates: rates.docs, team: team.docs, faqs: faqs.docs, brand }
  },
  ['cleanzo-public-content'],
  { tags: ['cleanzo-content'], revalidate: 60 },
)

export type CleanzoContent = Awaited<ReturnType<typeof getCleanzoContent>>
