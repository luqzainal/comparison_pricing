declare global {
  interface Window {
    grecaptcha: any
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      recaptcha: {
        ready: () => {
          return new Promise((resolve) => {
            if (window.grecaptcha && window.grecaptcha.ready) {
              window.grecaptcha.ready(resolve)
            } else {
              // Fallback if grecaptcha is not loaded yet
              const interval = setInterval(() => {
                if (window.grecaptcha && window.grecaptcha.ready) {
                  clearInterval(interval)
                  window.grecaptcha.ready(resolve)
                }
              }, 100)
            }
          })
        },
        render: (element: string | HTMLElement, options: any) => {
          if (window.grecaptcha && window.grecaptcha.render) {
            return window.grecaptcha.render(element, options)
          }
          return null
        },
        getResponse: (widgetId?: number) => {
          if (window.grecaptcha && window.grecaptcha.getResponse) {
            return window.grecaptcha.getResponse(widgetId)
          }
          return null
        },
        reset: (widgetId?: number) => {
          if (window.grecaptcha && window.grecaptcha.reset) {
            window.grecaptcha.reset(widgetId)
          }
        }
      }
    }
  }
}) 