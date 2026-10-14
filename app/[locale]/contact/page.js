import { Suspense } from 'react'
import Contact from './client-page'

export const metadata = {
  title: 'Contact - Ricky Burgin'
}

// client-page.js reads useSearchParams(); without a Suspense boundary the
// whole route opts out of static rendering.
export default function Page() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  )
}
