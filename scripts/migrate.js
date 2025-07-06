import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compare-harga'

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

async function createIndexes() {
  try {
    console.log('🔧 Creating database indexes...')
    
    // Product indexes
    await mongoose.connection.db.collection('products').createIndex(
      { name: 'text', description: 'text', searchKeywords: 'text' },
      { name: 'product_text_search' }
    )
    
    await mongoose.connection.db.collection('products').createIndex(
      { category: 1 },
      { name: 'product_category' }
    )
    
    await mongoose.connection.db.collection('products').createIndex(
      { brand: 1 },
      { name: 'product_brand' }
    )
    
    await mongoose.connection.db.collection('products').createIndex(
      { 'bestPrice.price': 1 },
      { name: 'product_best_price' }
    )
    
    await mongoose.connection.db.collection('products').createIndex(
      { isActive: 1 },
      { name: 'product_active' }
    )
    
    // User indexes
    await mongoose.connection.db.collection('users').createIndex(
      { googleId: 1 },
      { unique: true, name: 'user_google_id' }
    )
    
    await mongoose.connection.db.collection('users').createIndex(
      { email: 1 },
      { unique: true, name: 'user_email' }
    )
    
    await mongoose.connection.db.collection('users').createIndex(
      { 'searchHistory.timestamp': -1 },
      { name: 'user_search_history' }
    )
    
    // PriceHistory indexes
    await mongoose.connection.db.collection('pricehistories').createIndex(
      { productId: 1, platform: 1, recordedAt: -1 },
      { name: 'price_history_product_platform_date' }
    )
    
    await mongoose.connection.db.collection('pricehistories').createIndex(
      { platform: 1, recordedAt: -1 },
      { name: 'price_history_platform_date' }
    )
    
    await mongoose.connection.db.collection('pricehistories').createIndex(
      { productId: 1, platform: 1 },
      { name: 'price_history_product_platform' }
    )
    
    console.log('✅ Database indexes created successfully')
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
  }
}

async function updateSchema() {
  try {
    console.log('🔄 Updating database schema...')
    
    // Add new fields to existing products if they don't exist
    await mongoose.connection.db.collection('products').updateMany(
      { searchKeywords: { $exists: false } },
      { $set: { searchKeywords: [] } }
    )
    
    await mongoose.connection.db.collection('products').updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    )
    
    // Add new fields to existing users if they don't exist
    await mongoose.connection.db.collection('users').updateMany(
      { searchHistory: { $exists: false } },
      { $set: { searchHistory: [] } }
    )
    
    await mongoose.connection.db.collection('users').updateMany(
      { favoriteProducts: { $exists: false } },
      { $set: { favoriteProducts: [] } }
    )
    
    await mongoose.connection.db.collection('users').updateMany(
      { priceAlerts: { $exists: false } },
      { $set: { priceAlerts: [] } }
    )
    
    console.log('✅ Database schema updated successfully')
  } catch (error) {
    console.error('❌ Error updating schema:', error)
  }
}

async function cleanupData() {
  try {
    console.log('🧹 Cleaning up data...')
    
    // Remove products that are not active
    const result = await mongoose.connection.db.collection('products').deleteMany({
      isActive: false
    })
    
    console.log(`🗑️  Removed ${result.deletedCount} inactive products`)
    
    // Remove old price history (older than 1 year)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    const historyResult = await mongoose.connection.db.collection('pricehistories').deleteMany({
      recordedAt: { $lt: oneYearAgo }
    })
    
    console.log(`🗑️  Removed ${historyResult.deletedCount} old price history records`)
    
    console.log('✅ Data cleanup completed')
  } catch (error) {
    console.error('❌ Error cleaning up data:', error)
  }
}

async function main() {
  console.log('🚀 Starting database migration...')
  
  await connectDB()
  await createIndexes()
  await updateSchema()
  await cleanupData()
  
  console.log('✅ Database migration completed!')
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
}) 