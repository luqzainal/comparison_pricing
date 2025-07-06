import PriceHistory from '~/server/models/PriceHistory';
import Product from '~/server/models/Product';
import { isValidObjectId } from 'mongoose';

function calculateTrendAnalysis(historyData) {
  if (!historyData || historyData.length === 0) {
    return {
      lowestPrice: null,
      highestPrice: null,
      averagePrice: null,
      trend: 'stable',
      change30d: 0,
    };
  }

  let lowestPrice = Infinity;
  let highestPrice = -Infinity;
  let totalPrice = 0;
  
  historyData.forEach(item => {
    if (item.price < lowestPrice) lowestPrice = item.price;
    if (item.price > highestPrice) highestPrice = item.price;
    totalPrice += item.price;
  });

  const averagePrice = totalPrice / historyData.length;

  // Trend analysis based on the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentHistory = historyData.filter(item => new Date(item.recordedAt) > thirtyDaysAgo);
  let trend = 'stable';
  let change30d = 0;

  if (recentHistory.length > 1) {
    const firstPrice = recentHistory[0].price;
    const lastPrice = recentHistory[recentHistory.length - 1].price;
    change30d = ((lastPrice - firstPrice) / firstPrice) * 100;

    if (change30d > 5) trend = 'up';
    else if (change30d < -5) trend = 'down';
  }
  
  return {
    lowestPrice: lowestPrice === Infinity ? null : lowestPrice,
    highestPrice: highestPrice === -Infinity ? null : highestPrice,
    averagePrice,
    trend,
    change30d: change30d.toFixed(2),
  };
}

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!isValidObjectId(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Product ID',
    });
  }

  try {
    const product = await Product.findById(id).lean();

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }

    const historyData = await PriceHistory.find({ productId: id }).sort({ recordedAt: 'asc' }).lean();

    const history = {
      shopee: historyData.filter(h => h.platform === 'shopee'),
      lazada: historyData.filter(h => h.platform === 'lazada'),
    };
    
    const combinedHistory = [...history.shopee, ...history.lazada].sort((a,b) => new Date(a.recordedAt) - new Date(b.recordedAt));
    const trendAnalysis = calculateTrendAnalysis(combinedHistory);

    return { product, history, trendAnalysis };
  } catch (error) {
    console.error('Error fetching product details:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
}); 