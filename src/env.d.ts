/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  /** Dag-/avondstand (zie components/Daylight.astro). */
  coDaylight?: {
    apply: () => void;
    set: (pref: 'auto' | 'light' | 'dark' | string) => void;
  };
  coOpenCookieSettings?: () => void;
  coAnalyticsGranted?: boolean;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
