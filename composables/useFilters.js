import { useState } from '#app';

export const useFilters = () => {
  const filters = useState('filters', () => ({
    priceMin: null,
    priceMax: null,
    sellerRating: null,
    location: '',
    platforms: [],
    sortBy: 'relevance',
  }));

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const resetFilters = () => {
    filters.value = {
      priceMin: null,
      priceMax: null,
      sellerRating: null,
      location: '',
      platforms: [],
      sortBy: 'relevance',
    };
  };

  return {
    filters,
    setFilters,
    resetFilters,
  };
}; 