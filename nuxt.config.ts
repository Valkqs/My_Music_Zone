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
  },

  nitro: {
    // 将 content 目录作为服务器资产打包
    serverAssets: [
      {
        baseName: 'content', // 我们给这个资产起个名字叫 'content'
        dir: './content'     // 它对应我们项目根目录下的 content 文件夹
      }
    ]
  }
})
