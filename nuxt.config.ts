// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // SSR Configuration
  ssr: true,
  nitro: {
    preset: 'node-server'
  },

  // SEO Configuration
  app: {
    head: {
      title: 'CompareHarga - Bandingkan Harga Shopee & Lazada',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Platform perbandingan harga terbaik untuk membantu anda menjimatkan wang dengan membandingkan harga produk di Shopee dan Lazada.' 
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#2563eb' },
        { property: 'og:title', content: 'CompareHarga - Bandingkan Harga Shopee & Lazada' },
        { 
          property: 'og:description', 
          content: 'Platform perbandingan harga terbaik untuk membantu anda menjimatkan wang dengan membandingkan harga produk di Shopee dan Lazada.' 
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'CompareHarga' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'CompareHarga - Bandingkan Harga Shopee & Lazada' },
        { 
          name: 'twitter:description', 
          content: 'Platform perbandingan harga terbaik untuk membantu anda menjimatkan wang dengan membandingkan harga produk di Shopee dan Lazada.' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  css: ['~/assets/css/tailwind.css'],

  // https://nuxt.com/docs/api/configuration/nuxt-config#devserver
  devServer: {
    port: 3000,
  },

  // Konfigurasi runtime
  runtimeConfig: {
    // Private keys are only available on the server
    mongodbUri: process.env.MONGODB_URI,
    auth: {
      secret: process.env.AUTH_SECRET,
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
    scrapingSecret: process.env.SCRAPING_SECRET,
    // Keys within public are exposed to the client
    public: {
      appName: 'Aplikasi Perbandingan Harga',
    },
  },

  // Performance Optimization
  experimental: {
    payloadExtraction: false
  },

  // Build Configuration
  build: {
    transpile: ['@headlessui/vue']
  },

  // Vite Configuration
  vite: {
    optimizeDeps: {
      include: ['@headlessui/vue', '@heroicons/vue']
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt'
  ],

  // Konfigurasi auth module
  auth: {
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: {
      isEnabled: false // Akan diaktifkan kemudian melalui middleware khas
    },
    secret: '',
    google: {
      clientId: '',
      clientSecret: ''
    }
  },

  // Tailwind CSS Configuration
  tailwindcss: {
    config: {
      content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue"
      ],
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            },
            secondary: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
            }
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
        },
      },
      plugins: [],
    }
  }
})