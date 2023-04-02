/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    Nedb: import('@seald-io/nedb').default
  }
}