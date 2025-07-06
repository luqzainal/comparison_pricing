<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-4">CompareHarga</h1>
      <p class="text-center text-gray-600 mb-8">Aplikasi perbandingan harga sedang dibangunkan...</p>
      
      <!-- Test Section -->
      <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Status Aplikasi</h2>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span>Server</span>
            <span class="text-green-600">✓ Berjalan</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Auth</span>
            <span class="text-gray-500">- Dibuang</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Database</span>
            <span class="text-yellow-600">⚠ Tidak tersedia</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Halaman utama yang dipermudahkan
useHead({
  title: 'CompareHarga - Aplikasi Perbandingan Harga'
})
</script> 