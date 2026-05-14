import { FEATURES, FeatureName } from '@/lib/feature-flags'

export function useFeatureFlag(feature: FeatureName): boolean {
  return FEATURES[feature]
}
