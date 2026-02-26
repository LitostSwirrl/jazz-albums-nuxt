// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    baseURL: '/jazz-albums-nuxt/',
    head: {
      title: 'Jazz Albums Recommender',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A personal jazz listening guide and companion application.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/vite.svg' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
  },
  ssr: false,
  nitro: {
    preset: 'github-pages',
  },
})
