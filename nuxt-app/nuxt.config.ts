// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
  ],
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
    // mountain page generated on-demand, revalidates in background
    '/mountain': { swr: true },
    // about dashboard renders only on client-side
    '/about/**': { ssr: false },
    // Add cors headers on API routes
    '/api/**': { cors: true },
    // Redirects legacy urls
    '/parent/a': { redirect: '/parent/b' }
  }
})



