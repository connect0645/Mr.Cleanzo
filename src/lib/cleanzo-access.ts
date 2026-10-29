import type { Access, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const staffOnly: Access = ({ req }) => req.user?.collection === 'admins'

function invalidateSite() {
  try {
    revalidateTag('cleanzo-content', { expire: 0 })
    revalidatePath('/')
  } catch (error) {
    // CLI writes have no Next request cache; the public read's short TTL refreshes them.
    if (
      error instanceof Error &&
      /static generation store|incrementalCache|request store/i.test(error.message)
    )
      return
    throw error
  }
}

export const refreshContent: CollectionAfterChangeHook = ({ doc }) => {
  invalidateSite()
  return doc
}
export const removeContent: CollectionAfterDeleteHook = ({ doc }) => {
  invalidateSite()
  return doc
}
