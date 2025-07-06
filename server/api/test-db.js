import connectDB from '../utils/database.js'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    
    return {
      success: true,
      message: 'Database connected successfully',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}) 