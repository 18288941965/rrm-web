/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_LOGIN_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}