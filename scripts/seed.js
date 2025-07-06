import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import models
import Product from '../server/models/Product.js'
import User from '../server/models/User.js'
import PriceHistory from '../server/models/PriceHistory.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compare-harga'

// Sample data
const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'iPhone 15 Pro Max dengan chip A17 Pro, kamera 48MP, dan titanium design',
    category: 'Smartphone',
    brand: 'Apple',
    images: [
      'https://example.com/iphone15-1.jpg',
      'https://example.com/iphone15-2.jpg'
    ],
    specifications: {
      'Storage': '256GB',
      'Color': 'Natural Titanium',
      'Screen': '6.7 inch',
      'Chip': 'A17 Pro'
    },
    platforms: {
      shopee: {
        productId: 'shopee-iphone15-001',
        url: 'https://shopee.com.my/iphone15-pro-max',
        price: 5999,
        originalPrice: 6499,
        discount: 8,
        rating: 4.8,
        reviewCount: 1250,
        seller: {
          name: 'Apple Authorized Store',
          rating: 4.9,
          location: 'Kuala Lumpur'
        },
        stock: 15,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-iphone15-001',
        url: 'https://lazada.com.my/iphone15-pro-max',
        price: 5899,
        originalPrice: 6499,
        discount: 9,
        rating: 4.7,
        reviewCount: 980,
        seller: {
          name: 'LazMall Apple Store',
          rating: 4.8,
          location: 'Selangor'
        },
        stock: 12,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 5899,
      lastUpdated: new Date()
    },
    searchKeywords: ['iphone', 'apple', 'smartphone', 'mobile', '15 pro max'],
    isActive: true
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra dengan S Pen, kamera 200MP, dan AI features',
    category: 'Smartphone',
    brand: 'Samsung',
    images: [
      'https://example.com/s24-ultra-1.jpg',
      'https://example.com/s24-ultra-2.jpg'
    ],
    specifications: {
      'Storage': '512GB',
      'Color': 'Titanium Gray',
      'Screen': '6.8 inch',
      'Chip': 'Snapdragon 8 Gen 3'
    },
    platforms: {
      shopee: {
        productId: 'shopee-s24-ultra-001',
        url: 'https://shopee.com.my/s24-ultra',
        price: 5499,
        originalPrice: 5999,
        discount: 8,
        rating: 4.6,
        reviewCount: 890,
        seller: {
          name: 'Samsung Official Store',
          rating: 4.7,
          location: 'Kuala Lumpur'
        },
        stock: 20,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-s24-ultra-001',
        url: 'https://lazada.com.my/s24-ultra',
        price: 5399,
        originalPrice: 5999,
        discount: 10,
        rating: 4.5,
        reviewCount: 750,
        seller: {
          name: 'LazMall Samsung Store',
          rating: 4.6,
          location: 'Penang'
        },
        stock: 18,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 5399,
      lastUpdated: new Date()
    },
    searchKeywords: ['samsung', 'galaxy', 's24', 'ultra', 'smartphone'],
    isActive: true
  },
  {
    name: 'MacBook Air M3 13-inch',
    description: 'MacBook Air dengan chip M3, 13-inch Liquid Retina display, 8GB RAM, 256GB SSD',
    category: 'Laptop',
    brand: 'Apple',
    images: [
      'https://example.com/macbook-air-m3-1.jpg',
      'https://example.com/macbook-air-m3-2.jpg'
    ],
    specifications: {
      'Storage': '256GB SSD',
      'Color': 'Midnight',
      'Screen': '13.6 inch',
      'Chip': 'Apple M3',
      'RAM': '8GB'
    },
    platforms: {
      shopee: {
        productId: 'shopee-macbook-air-m3-001',
        url: 'https://shopee.com.my/macbook-air-m3',
        price: 4899,
        originalPrice: 5299,
        discount: 8,
        rating: 4.9,
        reviewCount: 450,
        seller: {
          name: 'Apple Authorized Store',
          rating: 4.9,
          location: 'Kuala Lumpur'
        },
        stock: 8,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-macbook-air-m3-001',
        url: 'https://lazada.com.my/macbook-air-m3',
        price: 4799,
        originalPrice: 5299,
        discount: 9,
        rating: 4.8,
        reviewCount: 320,
        seller: {
          name: 'LazMall Apple Store',
          rating: 4.8,
          location: 'Selangor'
        },
        stock: 5,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 4799,
      lastUpdated: new Date()
    },
    searchKeywords: ['macbook', 'apple', 'laptop', 'm3', 'air'],
    isActive: true
  },
  {
    name: 'AirPods Pro 2nd Generation',
    description: 'AirPods Pro generasi ke-2 dengan Active Noise Cancellation, MagSafe Charging Case',
    category: 'Audio',
    brand: 'Apple',
    images: [
      'https://example.com/airpods-pro-2-1.jpg',
      'https://example.com/airpods-pro-2-2.jpg'
    ],
    specifications: {
      'Type': 'True Wireless',
      'Color': 'White',
      'Battery': '6 hours + 24 hours case',
      'Features': 'Active Noise Cancellation'
    },
    platforms: {
      shopee: {
        productId: 'shopee-airpods-pro-2-001',
        url: 'https://shopee.com.my/airpods-pro-2',
        price: 1099,
        originalPrice: 1199,
        discount: 8,
        rating: 4.7,
        reviewCount: 890,
        seller: {
          name: 'Apple Authorized Store',
          rating: 4.9,
          location: 'Kuala Lumpur'
        },
        stock: 25,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-airpods-pro-2-001',
        url: 'https://lazada.com.my/airpods-pro-2',
        price: 1059,
        originalPrice: 1199,
        discount: 12,
        rating: 4.6,
        reviewCount: 670,
        seller: {
          name: 'LazMall Apple Store',
          rating: 4.8,
          location: 'Selangor'
        },
        stock: 30,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 1059,
      lastUpdated: new Date()
    },
    searchKeywords: ['airpods', 'apple', 'earphones', 'wireless', 'pro'],
    isActive: true
  },
  {
    name: 'PlayStation 5 Console',
    description: 'PlayStation 5 Console dengan 825GB SSD, DualSense Controller, 4K gaming',
    category: 'Gaming',
    brand: 'Sony',
    images: [
      'https://example.com/ps5-1.jpg',
      'https://example.com/ps5-2.jpg'
    ],
    specifications: {
      'Storage': '825GB SSD',
      'Color': 'White',
      'Controller': 'DualSense',
      'Resolution': '4K Gaming'
    },
    platforms: {
      shopee: {
        productId: 'shopee-ps5-001',
        url: 'https://shopee.com.my/ps5-console',
        price: 2599,
        originalPrice: 2799,
        discount: 7,
        rating: 4.8,
        reviewCount: 1450,
        seller: {
          name: 'Sony Official Store',
          rating: 4.7,
          location: 'Kuala Lumpur'
        },
        stock: 3,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-ps5-001',
        url: 'https://lazada.com.my/ps5-console',
        price: 2549,
        originalPrice: 2799,
        discount: 9,
        rating: 4.7,
        reviewCount: 1200,
        seller: {
          name: 'LazMall Sony Store',
          rating: 4.6,
          location: 'Selangor'
        },
        stock: 2,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 2549,
      lastUpdated: new Date()
    },
    searchKeywords: ['playstation', 'ps5', 'gaming', 'console', 'sony'],
    isActive: true
  },
  {
    name: 'Nintendo Switch OLED Model',
    description: 'Nintendo Switch OLED Model dengan 7-inch OLED screen, enhanced audio',
    category: 'Gaming',
    brand: 'Nintendo',
    images: [
      'https://example.com/switch-oled-1.jpg',
      'https://example.com/switch-oled-2.jpg'
    ],
    specifications: {
      'Storage': '64GB',
      'Color': 'White',
      'Screen': '7-inch OLED',
      'Type': 'Handheld/Docked'
    },
    platforms: {
      shopee: {
        productId: 'shopee-switch-oled-001',
        url: 'https://shopee.com.my/switch-oled',
        price: 1499,
        originalPrice: 1599,
        discount: 6,
        rating: 4.9,
        reviewCount: 780,
        seller: {
          name: 'Nintendo Official Store',
          rating: 4.8,
          location: 'Kuala Lumpur'
        },
        stock: 12,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-switch-oled-001',
        url: 'https://lazada.com.my/switch-oled',
        price: 1459,
        originalPrice: 1599,
        discount: 9,
        rating: 4.8,
        reviewCount: 650,
        seller: {
          name: 'LazMall Nintendo Store',
          rating: 4.7,
          location: 'Penang'
        },
        stock: 8,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 1459,
      lastUpdated: new Date()
    },
    searchKeywords: ['nintendo', 'switch', 'oled', 'gaming', 'portable'],
    isActive: true
  },
  {
    name: 'iPad Air 5th Generation',
    description: 'iPad Air dengan M1 chip, 10.9-inch Liquid Retina display, Wi-Fi 256GB',
    category: 'Tablet',
    brand: 'Apple',
    images: [
      'https://example.com/ipad-air-5-1.jpg',
      'https://example.com/ipad-air-5-2.jpg'
    ],
    specifications: {
      'Storage': '256GB',
      'Color': 'Space Gray',
      'Screen': '10.9 inch',
      'Chip': 'Apple M1'
    },
    platforms: {
      shopee: {
        productId: 'shopee-ipad-air-5-001',
        url: 'https://shopee.com.my/ipad-air-5',
        price: 2999,
        originalPrice: 3299,
        discount: 9,
        rating: 4.8,
        reviewCount: 560,
        seller: {
          name: 'Apple Authorized Store',
          rating: 4.9,
          location: 'Kuala Lumpur'
        },
        stock: 15,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-ipad-air-5-001',
        url: 'https://lazada.com.my/ipad-air-5',
        price: 2899,
        originalPrice: 3299,
        discount: 12,
        rating: 4.7,
        reviewCount: 420,
        seller: {
          name: 'LazMall Apple Store',
          rating: 4.8,
          location: 'Selangor'
        },
        stock: 10,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 2899,
      lastUpdated: new Date()
    },
    searchKeywords: ['ipad', 'apple', 'tablet', 'air', 'm1'],
    isActive: true
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Sony WH-1000XM5 dengan Industry Leading Noise Canceling, 30-hour battery',
    category: 'Audio',
    brand: 'Sony',
    images: [
      'https://example.com/sony-wh1000xm5-1.jpg',
      'https://example.com/sony-wh1000xm5-2.jpg'
    ],
    specifications: {
      'Type': 'Over-ear Wireless',
      'Color': 'Black',
      'Battery': '30 hours',
      'Features': 'Active Noise Cancellation'
    },
    platforms: {
      shopee: {
        productId: 'shopee-sony-wh1000xm5-001',
        url: 'https://shopee.com.my/sony-wh1000xm5',
        price: 1599,
        originalPrice: 1799,
        discount: 11,
        rating: 4.6,
        reviewCount: 340,
        seller: {
          name: 'Sony Official Store',
          rating: 4.7,
          location: 'Kuala Lumpur'
        },
        stock: 18,
        lastUpdated: new Date()
      },
      lazada: {
        productId: 'lazada-sony-wh1000xm5-001',
        url: 'https://lazada.com.my/sony-wh1000xm5',
        price: 1549,
        originalPrice: 1799,
        discount: 14,
        rating: 4.5,
        reviewCount: 280,
        seller: {
          name: 'LazMall Sony Store',
          rating: 4.6,
          location: 'Penang'
        },
        stock: 22,
        lastUpdated: new Date()
      }
    },
    bestPrice: {
      platform: 'lazada',
      price: 1549,
      lastUpdated: new Date()
    },
    searchKeywords: ['sony', 'headphones', 'wireless', 'noise cancelling', 'wh1000xm5'],
    isActive: true
  }
]

const sampleUsers = [
  {
    googleId: 'sample-user-001',
    email: 'user1@example.com',
    name: 'Ahmad Ali',
    picture: 'https://example.com/avatar1.jpg',
    searchHistory: [
      { query: 'iPhone 15', timestamp: new Date() },
      { query: 'Samsung Galaxy', timestamp: new Date() }
    ],
    favoriteProducts: [],
    priceAlerts: [],
    createdAt: new Date(),
    lastLogin: new Date()
  }
]

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    // Insert sample products
    const products = await Product.insertMany(sampleProducts)
    console.log(`✅ Inserted ${products.length} products`)

    // Create price history for products
    for (const product of products) {
      const priceHistory = []
      
      // Generate 30 days of price history
      for (let i = 30; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        // Simulate price fluctuations
        const shopeePrice = product.platforms.shopee.price + Math.floor(Math.random() * 200) - 100
        const lazadaPrice = product.platforms.lazada.price + Math.floor(Math.random() * 200) - 100
        
        priceHistory.push(
          {
            productId: product._id,
            platform: 'shopee',
            price: Math.max(shopeePrice, 1000), // Minimum price
            originalPrice: product.platforms.shopee.originalPrice,
            discount: Math.floor(Math.random() * 15),
            stock: Math.floor(Math.random() * 50),
            rating: product.platforms.shopee.rating,
            reviewCount: product.platforms.shopee.reviewCount,
            seller: product.platforms.shopee.seller,
            recordedAt: date
          },
          {
            productId: product._id,
            platform: 'lazada',
            price: Math.max(lazadaPrice, 1000), // Minimum price
            originalPrice: product.platforms.lazada.originalPrice,
            discount: Math.floor(Math.random() * 15),
            stock: Math.floor(Math.random() * 50),
            rating: product.platforms.lazada.rating,
            reviewCount: product.platforms.lazada.reviewCount,
            seller: product.platforms.lazada.seller,
            recordedAt: date
          }
        )
      }
      
      await PriceHistory.insertMany(priceHistory)
    }
    
    console.log('✅ Created price history for all products')
  } catch (error) {
    console.error('❌ Error seeding products:', error)
  }
}

async function seedUsers() {
  try {
    // Clear existing users
    await User.deleteMany({})
    console.log('🗑️  Cleared existing users')

    // Insert sample users
    const users = await User.insertMany(sampleUsers)
    console.log(`✅ Inserted ${users.length} users`)
  } catch (error) {
    console.error('❌ Error seeding users:', error)
  }
}

async function main() {
  console.log('🌱 Starting database seeding...')
  
  await connectDB()
  await seedProducts()
  await seedUsers()
  
  console.log('✅ Database seeding completed!')
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Seeding failed:', error)
  process.exit(1)
}) 