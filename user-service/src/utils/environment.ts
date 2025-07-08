/**
 * Environment utility functions
 */

export const Environment = {
  isDevelopment: () => process.env.NODE_ENV !== 'production',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test',
  current: () => process.env.NODE_ENV || 'development',
} as const;
