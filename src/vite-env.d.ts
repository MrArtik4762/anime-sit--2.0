/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANILIBRIA_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}