'use client'
import { FEATURES, FeatureName } from '@/lib/feature-flags'

interface Props {
  feature: FeatureName
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureFlag({ feature, children, fallback = null }: Props) {
  if (!FEATURES[feature]) return <>{fallback}</>
  return <>{children}</>
}
