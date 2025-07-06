<template>
  <div class="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 class="text-lg font-semibold mb-4 border-b pb-2">Tapis & Susun</h3>
    <div class="space-y-6 pt-2">
      
      <!-- Price Range Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">Julat Harga</h4>
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <input
              v-model="filters.priceMin"
              type="number"
              placeholder="Min"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              @input="applyFilters"
            >
            <span class="text-gray-500">-</span>
            <input
              v-model="filters.priceMax"
              type="number"
              placeholder="Max"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              @input="applyFilters"
            >
          </div>
          
          <!-- Quick Price Range Options -->
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="range in priceRanges"
              :key="range.label"
              @click="setPriceRange(range.min, range.max)"
              class="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              :class="{ 'bg-blue-50 border-blue-300 text-blue-700': isPriceRangeActive(range.min, range.max) }"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Seller Rating Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">Penarafan Penjual</h4>
        <div class="grid grid-cols-2 gap-2">
           <button
            v-for="rating in ratingOptions"
            :key="rating.value"
            @click="setRatingFilter(rating.value)"
            class="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
            :class="{ 'bg-blue-50 border-blue-300 text-blue-700': isRatingActive(rating.value) }"
          >
            <span>{{ rating.label }}</span>
            <svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </button>
        </div>
      </div>

      <!-- Location Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">Lokasi</h4>
        <div class="space-y-3">
          <input
            v-model="filters.location"
            type="text"
            placeholder="Cth: Selangor, KL"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleLocationInput"
          >
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="loc in locationOptions"
              :key="loc"
              @click="setLocationFilter(loc)"
              class="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              :class="{ 'bg-blue-50 border-blue-300 text-blue-700': isLocationActive(loc) }"
            >
              {{ loc }}
            </button>
          </div>
        </div>
      </div>

      <!-- Platform Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">Platform</h4>
        <div class="space-y-2">
          <div v-for="platform in platformOptions" :key="platform.id" class="flex items-center">
            <input
              :id="'platform-' + platform.id"
              v-model="filters.platforms"
              :value="platform.id"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              @change="handleCheckboxChange"
            >
            <label :for="'platform-' + platform.id" class="ml-2 block text-sm text-gray-900">
              {{ platform.name }}
            </label>
          </div>
        </div>
      </div>

      <!-- Sort By Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">Susun Ikut</h4>
        <div class="space-y-2">
          <div v-for="sort in sortOptions" :key="sort.id" class="flex items-center">
            <input
              :id="'sort-' + sort.id"
              v-model="filters.sortBy"
              :value="sort.id"
              name="sort-by"
              type="radio"
              class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              @change="handleSortChange"
            >
            <label :for="'sort-' + sort.id" class="ml-2 block text-sm text-gray-900">
              {{ sort.name }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFilters } from '~/composables/useFilters';

// Define emits
const emit = defineEmits(['filters-changed']);

// Use global filter state
const { filters, setFilters } = useFilters();

// Quick price range options
const priceRanges = [
  { label: 'Bawah RM50', min: null, max: 50 },
  { label: 'RM50-100', min: 50, max: 100 },
  { label: 'RM100-200', min: 100, max: 200 },
  { label: 'RM200-500', min: 200, max: 500 },
  { label: 'RM500-1000', min: 500, max: 1000 },
  { label: 'Atas RM1000', min: 1000, max: null }
];

// Seller rating options
const ratingOptions = [
  { label: '4+', value: 4 },
  { label: '3+', value: 3 },
  { label: '2+', value: 2 },
  { label: '1+', value: 1 }
];

// Location options
const locationOptions = ['Selangor', 'Kuala Lumpur', 'Pulau Pinang', 'Johor'];

// Platform options
const platformOptions = [
  { id: 'shopee', name: 'Shopee' },
  { id: 'lazada', name: 'Lazada' },
];

// Sort options
const sortOptions = [
  { id: 'relevance', name: 'Relevan' },
  { id: 'price-asc', name: 'Harga: Rendah ke Tinggi' },
  { id: 'price-desc', name: 'Harga: Tinggi ke Rendah' },
  { id: 'rating', name: 'Penilaian Tertinggi' },
  { id: 'popularity', name: 'Paling Popular' },
];

// Check if a price range is currently active
const isPriceRangeActive = (min, max) => {
  return filters.value.priceMin === min && filters.value.priceMax === max;
};

// Set price range from quick options
const setPriceRange = (min, max) => {
  setFilters({ priceMin: min, priceMax: max });
  applyFilters();
};

// Check if a rating filter is active
const isRatingActive = (minRating) => {
  return filters.value.sellerRating === minRating;
};

// Set seller rating filter
const setRatingFilter = (minRating) => {
  // Toggle off if the same rating is clicked again
  const newRating = filters.value.sellerRating === minRating ? null : minRating;
  setFilters({ sellerRating: newRating });
  applyFilters();
};

// Check if a location quick filter is active
const isLocationActive = (loc) => {
  return filters.value.location.toLowerCase() === loc.toLowerCase();
};

// Set location from quick options
const setLocationFilter = (loc) => {
  // Toggle off if the same location is clicked again
  const newLocation = filters.value.location.toLowerCase() === loc.toLowerCase() ? '' : loc;
  setFilters({ location: newLocation });
  applyFilters();
};

const handleLocationInput = () => {
  setFilters({ location: filters.value.location });
  applyFilters();
};

const handleCheckboxChange = () => {
  setFilters({ platforms: filters.value.platforms });
  applyFilters();
};

const handleSortChange = () => {
  setFilters({ sortBy: filters.value.sortBy });
  applyFilters();
};

// Apply filters and emit to parent component
const applyFilters = () => {
  emit('filters-changed', filters.value);
  // The console log can be removed or kept for debugging
  console.log('Applying filters from sidebar:', filters.value);
};
</script> 