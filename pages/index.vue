<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          Bandingkan Harga
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Dapatkan harga terbaik untuk produk kegemaran anda di Shopee dan Lazada
        </p>
      </div>

      <!-- Search Section -->
      <div class="max-w-2xl mx-auto mb-12">
        <SearchBar />
      </div>

      <!-- Popular Searches -->
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Carian Popular
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            v-for="term in popularSearches" 
            :key="term"
            @click="searchProduct(term)"
            class="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div class="text-center">
              <div class="text-lg font-medium text-gray-900 mb-1">{{ term }}</div>
              <div class="text-sm text-gray-500">Cari sekarang</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Trending Products Section -->
      <div class="max-w-6xl mx-auto mt-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          Produk Trending
        </h2>
        <div v-if="trendingProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <ProductCard 
            v-for="product in trendingProducts" 
            :key="product._id"
            :product="product"
            @click="viewProduct(product._id)"
          />
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">Memuat produk trending...</p>
        </div>
      </div>

      <!-- Features Section -->
      <div class="max-w-6xl mx-auto mt-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          Mengapa Pilih Kami?
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon class="h-8 w-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Carian Pantas</h3>
            <p class="text-gray-600">Cari produk dengan cepat dan mudah di kedua-dua platform</p>
          </div>
          <div class="text-center">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Perbandingan Harga</h3>
            <p class="text-gray-600">Bandingkan harga secara real-time untuk jimat wang</p>
          </div>
          <div class="text-center">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon class="h-8 w-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Tracking Harga</h3>
            <p class="text-gray-600">Pantau perubahan harga dan dapatkan notifikasi</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const popularSearches = ref([
  'iPhone 15',
  'Samsung Galaxy',
  'Laptop Gaming',
  'Headphone Wireless',
  'Smart Watch',
  'Camera DSLR',
  'Gaming Console',
  'Tablet iPad'
])

const trendingProducts = ref([])

const searchProduct = (term) => {
  navigateTo(`/search?q=${encodeURIComponent(term)}`)
}

const viewProduct = (productId) => {
  navigateTo(`/product/${productId}`)
}

const loadTrendingProducts = async () => {
  try {
    const response = await $fetch('/api/search', {
      method: 'GET',
      params: {
        q: '',
        limit: 6,
        sort: 'rating'
      }
    })
    
    if (response.success) {
      trendingProducts.value = response.data.products
    }
  } catch (error) {
    console.error('Error loading trending products:', error)
  }
}

onMounted(() => {
  loadTrendingProducts()
})
</script> 