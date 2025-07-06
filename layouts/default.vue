<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-xl font-bold text-gray-900">CompareHarga</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-gray-600">
          <p>&copy; 2025 CompareHarga. Semua hak terpelihara.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout mudah untuk testing
</script>