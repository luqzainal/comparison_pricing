import { fetchHtml, extractLazadaJson } from '~/utils/scraping';
import { getCache, setCache } from '~/server/utils/cache';

// Helper function to construct the Lazada search URL
function getLazadaSearchUrl(keyword) {
  const params = new URLSearchParams({
    q: keyword,
    _keyori: 'ss',
    from: 'input',
    spm: 'a2o4k.searchlist.search.go.19734851Jtq62v' // This spm might need updates
  });
  // The domain might need to change based on the target region (e.g., lazada.co.id)
  return `https://www.lazada.com.my/catalog/?${params.toString()}`;
}

// Simple validation for a Lazada item
function isValidLazadaItem(item) {
  if (!item || !item.name || !item.price || !item.itemId || !item.productUrl) {
    console.warn('[SCRAPE][Lazada] Skipping invalid item:', JSON.stringify(item));
    return false;
  }
  return true;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const keyword = query.keyword;

  if (!keyword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search keyword is required',
    });
  }

  // Create cache key based on keyword
  const cacheKey = `lazada:search:${keyword.toLowerCase()}`;
  
  // Check cache first
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log(`[SCRAPE][Lazada] Returning cached data for: ${keyword}`);
    return cachedData;
  }

  const lazadaSearchUrl = getLazadaSearchUrl(keyword);

  try {
    const html = await fetchHtml(lazadaSearchUrl);
    const jsonData = extractLazadaJson(html);

    if (!jsonData || !jsonData.mods || !jsonData.mods.listItems) {
      console.error('[SCRAPE][Lazada] JSON structure not as expected or not found.');
      return { source: 'Lazada', items: [] };
    }

    // Process the items to create a standardized format
    const products = jsonData.mods.listItems
      .filter(isValidLazadaItem)
      .map(item => {
        return {
          platform: 'Lazada',
          name: item.name,
          price: item.price,
          currency: 'MYR', // Lazada API doesn't always provide currency, assuming MYR
          imageUrl: `https:${item.image}`, // Lazada image URLs might not have protocol
          productUrl: `https:${item.productUrl}`,
          rating: item.ratingScore,
          sold: item.trade_count_custom, // Field name might vary
          shopLocation: item.location,
          shopId: item.sellerId,
          itemId: item.itemId,
        };
      });

    const result = {
      source: 'Lazada',
      items: products,
    };

    // Cache the result for 5 minutes (300 seconds)
    await setCache(cacheKey, result, 300);

    return result;

  } catch (error) {
    console.error(`[SCRAPE][Lazada] Failed to fetch or parse data. Status: ${error.statusCode}, Message: ${error.message}`);
    // Return a structured error response
    return { 
      source: 'Lazada', 
      items: [], 
      error: `Failed to fetch or parse data from Lazada. Status: ${error.statusCode}` 
    };
  }
}); 