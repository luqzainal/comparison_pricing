<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <NuxtLink to="/" class="hover:text-blue-600">Laman Utama</NuxtLink>
          </li>
          <li>
            <ChevronRightIcon class="h-4 w-4" />
          </li>
          <li>
            <NuxtLink to="/search" class="hover:text-blue-600">Carian</NuxtLink>
          </li>
          <li>
            <ChevronRightIcon class="h-4 w-4" />
          </li>
          <li class="text-gray-900">{{ product?.name || 'Produk' }}</li>
        </ol>
      </nav>

      <div v-if="pending" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Memuatkan butiran produk...</p>
      </div>
      <div v-else-if="error || !product" class="text-center py-20">
        <h2 class="text-2xl font-bold text-red-600 mb-4">Produk Tidak Ditemui</h2>
        <p class="text-gray-600 mb-6">Maaf, kami tidak dapat mencari produk yang anda minta.</p>
        <p v-if="error" class="text-sm text-gray-500 bg-red-50 p-2 rounded">{{ error.message }}</p>
        <NuxtLink to="/" class="btn-primary mt-6">Kembali ke Laman Utama</NuxtLink>
      </div>
      <div v-else class="space-y-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="lg:col-span-2">
            <h1 class="text-4xl font-extrabold text-gray-900">{{ product.name }}</h1>
            <p class="text-lg text-gray-600 mt-2">{{ product.description }}</p>
          </div>
          <div class="mt-8 lg:mt-0">
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <h2 class="text-xl font-semibold mb-4">Urus Notifikasi</h2>
              <button 
                @click="openAlertModal" 
                class="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <BellIcon class="h-5 w-5" />
                <span>Set Alert Harga</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Price Trend Analysis -->
        <div v-if="trendAnalysis" class="bg-white p-6 rounded-lg shadow-sm border">
          <h2 class="text-xl font-semibold mb-4">Analisis Harga</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p class="text-sm text-gray-500">Harga Terendah</p>
              <p class="text-2xl font-bold text-green-600">RM{{ trendAnalysis.lowestPrice?.toFixed(2) || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Harga Tertinggi</p>
              <p class="text-2xl font-bold text-red-600">RM{{ trendAnalysis.highestPrice?.toFixed(2) || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Harga Purata</p>
              <p class="text-2xl font-bold text-blue-600">RM{{ trendAnalysis.averagePrice?.toFixed(2) || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Trend 30 Hari</p>
              <div class="flex items-center justify-center space-x-1 text-2xl font-bold" :class="{ 'text-green-600': trendAnalysis.trend === 'down', 'text-red-600': trendAnalysis.trend === 'up', 'text-gray-600': trendAnalysis.trend === 'stable' }">
                <span v-if="trendAnalysis.trend === 'down'">↓</span>
                <span v-if="trendAnalysis.trend === 'up'">↑</span>
                <span v-if="trendAnalysis.trend === 'stable'">→</span>
                <span>{{ trendAnalysis.change30d }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Price History Graph -->
        <PriceHistoryGraph :history-data="history" :is-loading="pending" />
      </div>
    </div>

    <!-- Price Alert Modal -->
    <TransitionRoot as="template" :show="isAlertModalOpen">
      <Dialog as="div" class="relative z-10" @close="isAlertModalOpen = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <BellIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Set Alert Harga</DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          Kami akan memberitahu anda apabila harga untuk produk ini jatuh di bawah harga sasaran anda.
                        </p>
                        <div class="mt-4">
                          <label for="price" class="block text-sm font-medium text-gray-700">Harga Sasaran (RM)</label>
                          <div class="mt-1">
                            <input type="number" v-model="targetPrice" name="price" id="price" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="cth: 1200.00" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="button" class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" @click="handleSetAlert">Set Alert</button>
                  <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="isAlertModalOpen = false">Batal</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { BellIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const route = useRoute()
const productId = route.params.id

// State for modal
const isAlertModalOpen = ref(false)
const targetPrice = ref(null)

const { data, pending, error } = await useAsyncData(
  `product-details-${productId}`,
  () => $fetch(`/api/products/${productId}`),
  { pick: ['product', 'history', 'trendAnalysis'] }
)

const product = computed(() => data.value?.product)
const history = computed(() => data.value?.history)
const trendAnalysis = computed(() => data.value?.trendAnalysis)

// Handle case where fetch is successful but product is not found
if (!error.value && !product.value) {
  error.value = createError({ statusCode: 404, statusMessage: 'Product Not Found' })
}

useHead({
  title: () => product.value ? `${product.value.name} - CompareHarga` : 'Butiran Produk',
  meta: [
    { 
      name: 'description', 
      content: () => product.value ? `Sejarah harga dan perbandingan untuk ${product.value.name}` : 'Bandingkan harga produk di Shopee dan Lazada.' 
    }
  ]
})

function openAlertModal() {
  isAlertModalOpen.value = true
}

async function handleSetAlert() {
  if (!targetPrice.value || targetPrice.value <= 0) {
    alert('Sila masukkan harga sasaran yang sah.');
    return;
  }
  
  try {
    await $fetch('/api/alerts', {
      method: 'POST',
      body: {
        productId: productId,
        targetPrice: targetPrice.value
      }
    });
    alert('Alert harga telah berjaya ditetapkan!');
    isAlertModalOpen.value = false;
    targetPrice.value = null;
  } catch (err) {
    console.error('Error setting price alert:', err);
    alert('Gagal menetapkan alert harga. Sila cuba lagi.');
  }
}
</script> 