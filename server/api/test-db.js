// import connectDB from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // Temporarily disable MongoDB connection test
    // await connectDB()
    
    return {
      success: true,
      message: 'Database connection test bypassed (MongoDB not available)',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Database connection error:', error)
    
    return {
      success: false,
      message: 'Database connection failed: ' + error.message,
      timestamp: new Date().toISOString()
    }
  }
}) 