<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <div class="max-w-2xl mx-auto mb-6">
          <SearchBar />
        </div>
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Hasil Carian: "{{ searchQuery }}"
          </h1>
          <p class="text-gray-600">
            {{ totalResults }} produk dijumpai
          </p>
        </div>
      </div>

      <!-- Filter and Results Layout -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filter Sidebar -->
        <div class="lg:w-1/4">
          <FilterSidebar @filters-changed="handleFiltersChanged" />
        </div>

        <!-- Results -->
        <div class="lg:w-3/4">
          <!-- Sort Options (This is now handled by the sidebar, can be removed or kept for quick access) -->
          <div class="flex justify-end items-center mb-6">
            <div class="text-sm text-gray-600">
              {{ showingResults }} daripada {{ totalResults }} produk
            </div>
          </div>

          <!-- Loading State - Matches dual platform grid -->
          <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-200"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-16 bg-orange-100 rounded-lg"></div>
                  <div class="h-16 bg-blue-100 rounded-lg"></div>
                </div>
                <div class="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Results Grid - Optimized for dual platform display -->
          <div v-else-if="products.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProductCard 
              v-for="product in products" 
              :key="product._id"
              :product="product"
              @click="viewProduct(product._id)"
              class="h-full"
            />
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <MagnifyingGlassIcon class="h-16 w-16 mx-auto" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Tiada produk dijumpai
            </h3>
            <p class="text-gray-600 mb-6">
              Cuba ubah kata kunci carian atau filter anda
            </p>
            <button 
              @click="resetFiltersAndSearch"
              class="btn-primary"
            >
              Reset Filter
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-8">
            <nav class="flex items-center space-x-2">
              <button 
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sebelum
              </button>
              <span 
                v-for="page in visiblePages" 
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 text-sm border rounded-lg cursor-pointer',
                  page === currentPage 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </span>
              <button 
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Seterus
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useFilters } from '~/composables/useFilters';

const route = useRoute()
const { filters, resetFilters } = useFilters();
const searchQuery = ref(route.query.q || '');
const products = ref([])
const loading = ref(false)
const totalResults = ref(0)
const currentPage = ref(1)
const itemsPerPage = 12

const totalPages = computed(() => Math.ceil(totalResults.value / itemsPerPage))
const showingResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(currentPage.value * itemsPerPage, totalResults.value)
  return `${start}-${end}`
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

onMounted(() => {
  searchQuery.value = route.query.q || ''
  if (searchQuery.value) {
    performSearch()
  }
})

watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery || ''
  if (searchQuery.value) {
    currentPage.value = 1
    performSearch()
  }
}, { immediate: true });

const performSearch = async () => {
  loading.value = true;
  try {
    // Construct query params from global filter state
    const queryParams = {
      q: searchQuery.value,
      page: currentPage.value,
      limit: itemsPerPage,
      sortBy: filters.value.sortBy,
      platforms: filters.value.platforms.join(','),
      minPrice: filters.value.priceMin,
      maxPrice: filters.value.priceMax,
      location: filters.value.location,
      rating: filters.value.sellerRating,
    };
    
    // Remove empty params
    const cleanedParams = {}
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== null && queryParams[key] !== '') {
        cleanedParams[key] = queryParams[key]
      }
    })

    const response = await $fetch('/api/search', {
      method: 'GET',
      params: cleanedParams
    });
    
    if (response.success) {
      products.value = response.data.products
      totalResults.value = response.data.pagination.totalItems
    } else {
      console.error('Search failed:', response.error)
      products.value = []
      totalResults.value = 0
    }
  } catch (error) {
    console.error('Search error:', error)
    products.value = []
    totalResults.value = 0
  } finally {
    loading.value = false
  }
}

const handleFiltersChanged = () => {
  currentPage.value = 1;
  performSearch();
};

const resetFiltersAndSearch = () => {
  resetFilters();
  currentPage.value = 1;
  performSearch();
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    performSearch()
  }
}

const viewProduct = (productId) => {
  navigateTo(`/product/${productId}`)
}
</script> 