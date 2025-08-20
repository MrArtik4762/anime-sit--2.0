/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANILIBRIA_BASE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}