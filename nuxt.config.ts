// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/cloudinary',
    '@pinia/nuxt'
  ],
  cloudinary: {
    cloudName: 'dd4herx0f' // <--- 在这里替换成您自己的 Cloud Name
  }
})
