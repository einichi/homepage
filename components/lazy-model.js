'use client'

import dynamic from 'next/dynamic'
import ModelLoader from './model-loader'

const LazyModel = dynamic(() => import('./3d-model'), {
  ssr: false,
  loading: () => <ModelLoader />
})

export default LazyModel
