import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  googleId: string
  email: string
  name: string
  picture?: string
  searchHistory: Array<{
    query: string
    timestamp: Date
  }>
  favoriteProducts: Array<{
    productId: string
    addedAt: Date
  }>
  priceAlerts: Array<{
    productId: string
    targetPrice: number
    isActive: boolean
    createdAt: Date
  }>
  createdAt: Date
  lastLogin: Date
}

// Extended session type to include our custom id field
interface ExtendedSession {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const userProfile = ref<UserProfile | null>(null)
  const isLoadingProfile = ref(false)
  const profileError = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => {
    const { status } = useAuth()
    return status.value === 'authenticated'
  })

  const hasSearchHistory = computed(() => {
    return userProfile.value?.searchHistory && userProfile.value.searchHistory.length > 0
  })

  const favoriteCount = computed(() => {
    return userProfile.value?.favoriteProducts?.length || 0
  })

  const activeAlertsCount = computed(() => {
    return userProfile.value?.priceAlerts?.filter(alert => alert.isActive).length || 0
  })

  const sessionId = computed(() => {
    // Generate or retrieve session ID for tracking
    let id = localStorage.getItem('sessionId')
    if (!id) {
      id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('sessionId', id)
    }
    return id
  })

  // Actions
  const fetchUserProfile = async () => {
    const { data: session } = useAuth()
    const extendedSession = session.value as ExtendedSession
    
    if (!extendedSession?.user?.id) {
      userProfile.value = null
      return
    }

    isLoadingProfile.value = true
    profileError.value = null

    try {
      const response = await $fetch(`/api/users/${extendedSession.user.id}`) as UserProfile
      userProfile.value = response
    } catch (error) {
      console.error('Error fetching user profile:', error)
      profileError.value = 'Gagal memuat profil pengguna'
    } finally {
      isLoadingProfile.value = false
    }
  }

  const addToSearchHistory = async (query: string) => {
    const { data: session } = useAuth()
    const extendedSession = session.value as ExtendedSession
    
    if (!extendedSession?.user?.id) return

    try {
      await $fetch(`/api/users/${extendedSession.user.id}/search-history`, {
        method: 'POST',
        body: { query }
      })
      
      // Update local state
      if (userProfile.value) {
        userProfile.value.searchHistory.unshift({
          query,
          timestamp: new Date()
        })
        
        // Keep only last 20 searches
        if (userProfile.value.searchHistory.length > 20) {
          userProfile.value.searchHistory = userProfile.value.searchHistory.slice(0, 20)
        }
      }
    } catch (error) {
      console.error('Error adding to search history:', error)
    }
  }

  const addToClickHistory = async (clickData: any) => {
    const { data: session } = useAuth()
    const extendedSession = session.value as ExtendedSession
    
    if (!extendedSession?.user?.id) return

    try {
      await $fetch(`/api/users/${extendedSession.user.id}/click-history`, {
        method: 'POST',
        body: clickData
      })
      
      // Update local state - for now just store in localStorage as fallback
      const existingClicks = JSON.parse(localStorage.getItem('userClickHistory') || '[]')
      existingClicks.unshift(clickData)
      
      // Keep only last 50 clicks
      if (existingClicks.length > 50) {
        existingClicks.splice(50)
      }
      
      localStorage.setItem('userClickHistory', JSON.stringify(existingClicks))
    } catch (error) {
      console.error('Error adding to click history:', error)
      // Store locally as fallback
      const existingClicks = JSON.parse(localStorage.getItem('userClickHistory') || '[]')
      existingClicks.unshift(clickData)
      localStorage.setItem('userClickHistory', JSON.stringify(existingClicks))
    }
  }

  const addToFavorites = async (productId: string) => {
    const { data: session } = useAuth()
    const extendedSession = session.value as ExtendedSession
    
    if (!extendedSession?.user?.id) return

    try {
      await $fetch(`/api/users/${extendedSession.user.id}/favorites`, {
        method: 'POST',
        body: { productId }
      })
      
      // Update local state
      if (userProfile.value) {
        userProfile.value.favoriteProducts.push({
          productId,
          addedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  const removeFromFavorites = async (productId: string) => {
    const { data: session } = useAuth()
    const extendedSession = session.value as ExtendedSession
    
    if (!extendedSession?.user?.id) return

    try {
      await $fetch(`/api/users/${extendedSession.user.id}/favorites/${productId}`, {
        method: 'DELETE'
      })
      
      // Update local state
      if (userProfile.value) {
        userProfile.value.favoriteProducts = userProfile.value.favoriteProducts.filter(
          fav => fav.productId !== productId
        )
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  const createPriceAlert = async (productId: string, targetPrice: number) => {
    const { data: session } = useAuth()
    const extendedSession = session.value as ExtendedSession
    
    if (!extendedSession?.user?.id) return

    try {
      const newAlert = await $fetch(`/api/users/${extendedSession.user.id}/price-alerts`, {
        method: 'POST',
        body: { productId, targetPrice }
      })
      
      // Update local state
      if (userProfile.value) {
        userProfile.value.priceAlerts.push(newAlert as any)
      }
      
      return newAlert
    } catch (error) {
      console.error('Error creating price alert:', error)
      throw error
    }
  }

  const togglePriceAlert = async (alertId: string, isActive: boolean) => {
    const { data: session } = useAuth()
    const extendedSession = session.value as ExtendedSession
    
    if (!extendedSession?.user?.id) return

    try {
      await $fetch(`/api/users/${extendedSession.user.id}/price-alerts/${alertId}`, {
        method: 'PATCH',
        body: { isActive }
      })
      
      // Update local state
      if (userProfile.value) {
        const alert = userProfile.value.priceAlerts.find(a => a.productId === alertId)
        if (alert) {
          alert.isActive = isActive
        }
      }
    } catch (error) {
      console.error('Error toggling price alert:', error)
      throw error
    }
  }

  const clearProfile = () => {
    userProfile.value = null
    isLoadingProfile.value = false
    profileError.value = null
  }

  // Watch for auth status changes
  const { status } = useAuth()
  watch(status, (newStatus) => {
    if (newStatus === 'authenticated') {
      fetchUserProfile()
    } else if (newStatus === 'unauthenticated') {
      clearProfile()
    }
  }, { immediate: true })

  return {
    // State
    userProfile: readonly(userProfile),
    isLoadingProfile: readonly(isLoadingProfile),
    profileError: readonly(profileError),
    
    // Getters
    isAuthenticated,
    hasSearchHistory,
    favoriteCount,
    activeAlertsCount,
    sessionId,
    
    // Actions
    fetchUserProfile,
    addToSearchHistory,
    addToClickHistory,
    addToFavorites,
    removeFromFavorites,
    createPriceAlert,
    togglePriceAlert,
    clearProfile
  }
}) 