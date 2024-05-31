// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['maz-ui/nuxt', "@nuxtjs/tailwindcss"],
  ssr: false,
  nitro: {
    preset: 'static'
  },
  mazUi: {
    injectComponents: true,
    injectCss: true
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || "http://localhost:8080/api"
    }
  }
})