import { ofetch } from 'ofetch';
import { getCache, setCache } from '~/server/utils/cache';

// Helper function to construct the Shopee search API URL
function getShopeeSearchUrl(keyword, limit = 50) {
  const params = new URLSearchParams({
    by: 'relevancy',
    keyword: keyword,
    limit: limit.toString(),
    newest: '0',
    order: 'desc',
    page_type: 'search',
    scenario: 'PAGE_GLOBAL_SEARCH',
    version: '2',
  });
  // Note: The domain might need to change based on the target region (e.g., shopee.co.id, shopee.sg)
  return `https://shopee.com.my/api/v4/search/search_items?${params.toString()}`;
}

// Shopee uses specific headers, similar to a browser, to allow API access.
function getApiHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
     // This header can be important for Shopee's API
    'af-ac-enc-dat': 'AAcyLjUuMC0yAAABh5W64e0AAAIDAQAAAAAAmgAAAJDzAX+6YjB9wEAEAdF9W8sDMmGkZMI4n+nBI+6cI2C4bA86oF34j2qgEmMshdVo+p4/4VsD6Xf2JmRFAe+ZzFClz4Q=',
  };
}

// Simple validation for a Shopee item
function isValidShopeeItem(item) {
  const itemBasic = item.item_basic;
  if (!itemBasic || !itemBasic.name || typeof itemBasic.price === 'undefined' || !itemBasic.itemid || !itemBasic.shopid) {
    console.warn('[SCRAPE][Shopee] Skipping invalid item:', JSON.stringify(item));
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
  const cacheKey = `shopee:search:${keyword.toLowerCase()}`;
  
  // Check cache first
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log(`[SCRAPE][Shopee] Returning cached data for: ${keyword}`);
    return cachedData;
  }

  const shopeeApiUrl = getShopeeSearchUrl(keyword);

  try {
    const response = await ofetch(shopeeApiUrl, {
      headers: getApiHeaders(),
    });

    if (response.error || !response.items) {
      console.error('[SCRAPE][Shopee] API Error:', response.error_msg || 'No items found');
      return { source: 'Shopee', items: [] };
    }

    // Filter for valid items before processing
    const products = response.items
      .filter(isValidShopeeItem)
      .map(item => {
        const itemBasic = item.item_basic;
        return {
          platform: 'Shopee',
          name: itemBasic.name,
          price: (itemBasic.price / 100000).toFixed(2), // Price is in cents
          currency: itemBasic.currency,
          imageUrl: `https://cf.shopee.com.my/file/${itemBasic.image}`,
          productUrl: `https://shopee.com.my/${itemBasic.name.replace(/\s/g, '-')}-i.${itemBasic.shopid}.${itemBasic.itemid}`,
          rating: itemBasic.item_rating.rating_star.toFixed(2),
          sold: itemBasic.sold,
          shopLocation: itemBasic.shop_location,
          shopId: itemBasic.shopid,
          itemId: itemBasic.itemid,
        };
      });

    const result = {
      source: 'Shopee',
      items: products,
    };

    // Cache the result for 5 minutes (300 seconds)
    await setCache(cacheKey, result, 300);

    return result;

  } catch (error) {
    console.error(`[SCRAPE][Shopee] Failed to fetch data. Status: ${error.statusCode}, Message: ${error.message}`);
    // Return a structured error response instead of throwing an error
    return { 
      source: 'Shopee', 
      items: [], 
      error: `Failed to fetch data from Shopee. Status: ${error.statusCode}` 
    };
  }
}); 