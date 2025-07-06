<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border">
        <div class="mb-4">
          <h1 class="text-6xl font-extrabold text-red-500">{{ error.statusCode }}</h1>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          {{ title }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{ description }}
        </p>
        <button @click="handleError" class="btn-primary">
          Kembali ke Laman Utama
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  error: Object
});

const title = computed(() => {
  if (props.error.statusCode === 404) {
    return "Halaman Tidak Ditemui";
  }
  return "Berlaku Ralat";
});

const description = computed(() => {
  if (props.error.statusCode === 404) {
    return "Maaf, kami tidak dapat mencari halaman yang anda cari.";
  }
  return "Sesuatu yang tidak kena telah berlaku. Sila cuba lagi nanti.";
});

const handleError = () => clearError({ redirect: '/' });
</script> 