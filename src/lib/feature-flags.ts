export const FEATURES = {
  AUTH: process.env.NEXT_PUBLIC_FEATURE_AUTH !== 'false',
  CHAT: process.env.NEXT_PUBLIC_FEATURE_CHAT !== 'false',
  UPLOAD: process.env.NEXT_PUBLIC_FEATURE_UPLOAD !== 'false',
  QUIZ: process.env.NEXT_PUBLIC_FEATURE_QUIZ !== 'false',
  DASHBOARD: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD !== 'false',
} as const

export type FeatureName = keyof typeof FEATURES
