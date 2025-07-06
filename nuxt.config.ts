// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true,
  
  css: ['~/assets/css/tailwind.css'],
  
  devServer: {
    port: 3000,
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    // Private keys (only available on the server-side)
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    
    // Public keys (exposed to the client-side)
    public: {
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test site key
    }
  },

  app: {
    head: {
      script: [
        {
          src: 'https://www.google.com/recaptcha/api.js',
          async: true,
          defer: true
        }
      ]
    }
  }
})