<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Cari produk di Shopee & Lazada..."
        class="search-input pl-10 pr-4"
        @input="onSearchInput"
        @keydown="handleKeydown"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        autocomplete="off"
      />
      <div v-if="isLoading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && (filteredSuggestions.length > 0 || searchHistory.length > 0)"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
    >
      <!-- Search History Section -->
      <div v-if="searchHistory.length > 0 && !searchQuery.trim()" class="border-b border-gray-100">
        <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          Carian Terkini
        </div>
        <button
          v-for="(historyItem, index) in searchHistory.slice(0, 5)"
          :key="`history-${index}`"
          @click="selectSuggestion(historyItem.query)"
          :class="[
            'w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2',
            selectedIndex === index ? 'bg-blue-50' : ''
          ]"
        >
          <ClockIcon class="h-4 w-4 text-gray-400" />
          <span class="text-gray-700">{{ historyItem.query }}</span>
          <span class="text-xs text-gray-400 ml-auto">
            {{ formatRelativeTime(historyItem.timestamp) }}
          </span>
        </button>
      </div>

      <!-- Popular Searches Section -->
      <div v-if="filteredSuggestions.length > 0" class="border-b border-gray-100">
        <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          {{ searchQuery.trim() ? 'Cadangan' : 'Carian Popular' }}
        </div>
        <button
          v-for="(suggestion, index) in filteredSuggestions"
          :key="`suggestion-${index}`"
          @click="selectSuggestion(suggestion)"
          :class="[
            'w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2',
            selectedIndex === (searchHistory.length + index) ? 'bg-blue-50' : ''
          ]"
        >
          <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
          <span class="text-gray-700">{{ suggestion }}</span>
          <span v-if="!searchQuery.trim()" class="text-xs text-gray-400 ml-auto">Popular</span>
        </button>
      </div>

      <!-- No Results -->
      <div v-if="searchQuery.trim() && filteredSuggestions.length === 0" class="px-4 py-3 text-gray-500 text-center">
        Tiada cadangan untuk "{{ searchQuery }}"
      </div>

      <!-- Quick Search Button -->
      <div v-if="searchQuery.trim()" class="border-t border-gray-100">
        <button
          @click="performSearch"
          class="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 text-blue-600"
        >
          <ArrowRightIcon class="h-4 w-4" />
          <span>Cari "{{ searchQuery }}"</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Cari produk di Shopee & Lazada...'
  },
  autoFocus: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['search', 'suggestion-selected'])

// Refs
const searchInput = ref(null)
const searchQuery = ref('')
const showSuggestions = ref(false)
const isLoading = ref(false)
const selectedIndex = ref(-1)

// Store
const authStore = useAuthStore()

// Popular search suggestions (static for now, can be loaded from API later)
const popularSearches = ref([
  'iPhone 15',
  'Samsung Galaxy S24',
  'MacBook Air M3',
  'AirPods Pro',
  'Nintendo Switch',
  'PlayStation 5',
  'Xiaomi 14',
  'iPad Air',
  'Apple Watch',
  'Gaming Chair',
  'Mechanical Keyboard',
  'Wireless Mouse',
  'Monitor 4K',
  'SSD 1TB',
  'Power Bank',
  'Bluetooth Speaker',
  'Laptop Gaming',
  'Smartphone Murah',
  'Tablet Android',
  'Smart TV'
])

// Computed
const searchHistory = computed(() => {
  if (!authStore.isAuthenticated || !authStore.userProfile?.searchHistory) {
    return []
  }
  return authStore.userProfile.searchHistory
})

const filteredSuggestions = computed(() => {
  if (!searchQuery.value.trim()) {
    return popularSearches.value.slice(0, 8)
  }
  
  const query = searchQuery.value.toLowerCase()
  return popularSearches.value
    .filter(suggestion => 
      suggestion.toLowerCase().includes(query) &&
      suggestion.toLowerCase() !== query
    )
    .slice(0, 6)
})

const totalSuggestions = computed(() => {
  let count = 0
  if (!searchQuery.value.trim()) {
    count += Math.min(searchHistory.value.length, 5)
  }
  count += filteredSuggestions.value.length
  return count
})

// Methods
const onSearchInput = () => {
  selectedIndex.value = -1
  showSuggestions.value = true
}

const handleKeydown = (event) => {
  if (!showSuggestions.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, totalSuggestions.value - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0) {
        selectSuggestionByIndex(selectedIndex.value)
      } else {
        performSearch()
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedIndex.value = -1
      searchInput.value?.blur()
      break
  }
}

const handleBlur = () => {
  // Delay hiding suggestions to allow click events
  setTimeout(() => {
    showSuggestions.value = false
    selectedIndex.value = -1
  }, 150)
}

const selectSuggestionByIndex = (index) => {
  let suggestion = ''
  
  if (!searchQuery.value.trim() && searchHistory.value.length > 0) {
    if (index < Math.min(searchHistory.value.length, 5)) {
      suggestion = searchHistory.value[index].query
    } else {
      suggestion = filteredSuggestions.value[index - Math.min(searchHistory.value.length, 5)]
    }
  } else {
    suggestion = filteredSuggestions.value[index]
  }
  
  if (suggestion) {
    selectSuggestion(suggestion)
  }
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  selectedIndex.value = -1
  emit('suggestion-selected', suggestion)
  performSearch()
}

const performSearch = async () => {
  const query = searchQuery.value.trim()
  if (!query) return

  showSuggestions.value = false
  isLoading.value = true

  try {
    // Add to search history if user is authenticated
    if (authStore.isAuthenticated) {
      await authStore.addToSearchHistory(query)
    }

    // Emit search event
    emit('search', query)

    // Navigate to search page
    await navigateTo(`/search?q=${encodeURIComponent(query)}`)
  } catch (error) {
    console.error('Error performing search:', error)
  } finally {
    isLoading.value = false
  }
}

const formatRelativeTime = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Baru sahaja'
  if (diffInHours < 24) return `${diffInHours}j yang lalu`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`
  
  return date.toLocaleDateString('ms-MY')
}

// Lifecycle
onMounted(() => {
  if (props.autoFocus) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

// Expose methods for parent components
defineExpose({
  focus: () => searchInput.value?.focus(),
  clear: () => {
    searchQuery.value = ''
    showSuggestions.value = false
  }
})
</script>

<style scoped>
.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style> 