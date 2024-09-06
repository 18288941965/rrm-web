/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_LOGIN_KEY: string
    readonly AXIOS_DEFAULTS_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}