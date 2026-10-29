import { getCleanzoContent } from '@/lib/cleanzo-data'
import CleanzoWebsite from '@/components/CleanzoWebsite'

export default async function HomePage() {
  const content = await getCleanzoContent()
  return <CleanzoWebsite content={content} />
}
