import { defineStore } from 'pinia'

export interface User {
  _id: string
  email: string
  name: string
  picture?: string
  role: 'user' | 'admin'
  isVerified: boolean
  createdAt: string
  lastLogin: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  message?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    isAdmin: (state): boolean => state.user?.role === 'admin'
  },

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
    },

    async login(credentials: { email: string; password: string }) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        }) as AuthResponse

        if (response.success) {
          this.setUser(response.user || null)
          await navigateTo('/')
        } else {
          this.setError(response.error || 'Login gagal')
        }
      } catch (error: any) {
        this.setError(error.data?.error || 'Ralat semasa login')
      } finally {
        this.setLoading(false)
      }
    },

    async register(userData: {
      name: string
      email: string
      password: string
      recaptchaToken: string
    }) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        }) as AuthResponse

        if (response.success) {
          return { success: true, message: response.message }
        } else {
          this.setError(response.error || 'Pendaftaran gagal')
          return { success: false, error: response.error }
        }
      } catch (error: any) {
        const errorMessage = error.data?.error || 'Ralat semasa pendaftaran'
        this.setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        this.setLoading(false)
      }
    },

    async logout() {
      this.setLoading(true)
      
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST'
        })
        
        this.setUser(null)
        await navigateTo('/auth/login')
      } catch (error) {
        console.error('Ralat semasa logout:', error)
        // Tetap clear user walaupun API gagal
        this.setUser(null)
        await navigateTo('/auth/login')
      } finally {
        this.setLoading(false)
      }
    },

    async checkAuth() {
      this.setLoading(true)
      
      try {
        const response = await $fetch('/api/auth/me') as AuthResponse
        
        if (response.success && response.user) {
          this.setUser(response.user)
        } else {
          this.setUser(null)
        }
      } catch (error) {
        this.setUser(null)
      } finally {
        this.setLoading(false)
      }
    },

    async forgotPassword(email: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch('/api/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })

        return response
      } catch (error: any) {
        this.setError(error.data?.error || 'Ralat semasa menghantar e-mel')
        return { success: false, error: error.data?.error }
      } finally {
        this.setLoading(false)
      }
    },

    async resetPassword(token: string, password: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch('/api/auth/reset-password', {
          method: 'POST',
          body: { token, password }
        })

        return response
      } catch (error: any) {
        this.setError(error.data?.error || 'Ralat semasa menetapkan kata laluan')
        return { success: false, error: error.data?.error }
      } finally {
        this.setLoading(false)
      }
    }
  }
}) 