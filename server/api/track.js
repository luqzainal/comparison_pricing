import PriceHistory from '~/server/models/PriceHistory';
import Product from '~/server/models/Product';
import { isValidObjectId } from 'mongoose';

export default defineEventHandler(async (event) => {
  const { scrapingSecret } = useRuntimeConfig(event);
  const providedSecret = getHeader(event, 'x-scraping-secret');

  if (providedSecret !== scrapingSecret || !scrapingSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const body = await readBody(event);
  const { 
    productId, 
    platform, 
    price, 
    originalPrice,
    sellerName,
    rating,
    reviewCount
  } = body;

  // --- Validation ---
  if (!productId || !platform || !price) {
    throw createError({ statusCode: 400, statusMessage: 'productId, platform, and price are required.' });
  }
  if (!isValidObjectId(productId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Product ID.' });
  }
  if (!['shopee', 'lazada'].includes(platform)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid platform.' });
  }

  try {
    // 1. Create a new price history entry
    const newHistoryEntry = await PriceHistory.create({
      productId,
      platform,
      price,
      originalPrice,
      rating,
      reviewCount,
      seller: { name: sellerName }
    });

    // 2. Update the current price in the corresponding Product document
    const updateField = `platforms.${platform}.price`;
    const productUpdate = await Product.findByIdAndUpdate(
      productId,
      { 
        $set: { 
          [updateField]: price,
          [`platforms.${platform}.originalPrice`]: originalPrice,
          [`platforms.${platform}.rating`]: rating,
          [`platforms.${platform}.reviewCount`]: reviewCount,
          [`platforms.${platform}.seller.name`]: sellerName,
          'lastUpdatedAt': new Date()
        } 
      },
      { new: true }
    );

    if (!productUpdate) {
      // If product doesn't exist, we should probably handle this case
      // For now, the history is saved, but the main product isn't updated
      console.warn(`Product with ID ${productId} not found for price update.`);
    }

    return { success: true, entry: newHistoryEntry };

  } catch (error) {
    console.error('Error tracking price:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to track price.' });
  }
}); 