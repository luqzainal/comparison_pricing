<template>
  <div>
    <button @click="toggleMode" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle dark mode">
      <SunIcon v-if="$colorMode.value === 'dark'" class="h-6 w-6 text-gray-700 dark:text-gray-300" />
      <MoonIcon v-else class="h-6 w-6 text-gray-700 dark:text-gray-300" />
    </button>
  </div>
</template>

<script setup>
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const colorMode = useColorMode();

const toggleMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script> 