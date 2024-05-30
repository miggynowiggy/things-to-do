// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['maz-ui/nuxt', "@nuxtjs/tailwindcss"],
  ssr: false,
  mazUi: {
    injectComponents: true,
    injectCss: true
  }
})