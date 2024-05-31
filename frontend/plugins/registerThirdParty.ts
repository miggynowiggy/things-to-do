import { installToaster } from "maz-ui"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(installToaster, {
    position: 'top-right',
    timeout: 7000,
    persistent: false
  })
})