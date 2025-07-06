import mongoose from 'mongoose'

const priceHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  platform: {
    type: String,
    enum: ['shopee', 'lazada'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: Number,
  discount: Number,
  stock: Number,
  rating: Number,
  reviewCount: Number,
  seller: {
    name: String,
    rating: Number,
    location: String
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
})

// Index untuk performance
priceHistorySchema.index({ productId: 1, platform: 1, recordedAt: -1 })
priceHistorySchema.index({ platform: 1, recordedAt: -1 })

// Compound index untuk query yang kerap
priceHistorySchema.index({ productId: 1, platform: 1 })

export default mongoose.models.PriceHistory || mongoose.model('PriceHistory', priceHistorySchema) 