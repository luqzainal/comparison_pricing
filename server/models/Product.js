import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  category: {
    type: String,
  },
  brand: {
    type: String,
  },
  images: [String],
  specifications: {
    type: Map,
    of: String
  },
  platforms: {
    shopee: {
      productId: String,
      url: String,
      price: Number,
      originalPrice: Number,
      discount: Number,
      rating: Number,
      reviewCount: Number,
      seller: {
        name: String,
        rating: Number,
        location: String
      },
      stock: Number,
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    lazada: {
      productId: String,
      url: String,
      price: Number,
      originalPrice: Number,
      discount: Number,
      rating: Number,
      reviewCount: Number,
      seller: {
        name: String,
        rating: Number,
        location: String
      },
      stock: Number,
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }
  },
  bestPrice: {
    platform: {
      type: String,
      enum: ['shopee', 'lazada'],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  searchKeywords: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Index untuk performance
productSchema.index({ name: 'text', description: 'text', searchKeywords: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ brand: 1 })
productSchema.index({ 'bestPrice.price': 1 })
productSchema.index({ isActive: 1 })

// Update timestamp sebelum save
productSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema) 