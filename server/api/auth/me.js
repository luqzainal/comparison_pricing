import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/database.js'
import { getUserFromToken } from '~/server/utils/auth.js'

export default defineEventHandler(async (event) => {
  // Hanya terima GET request
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method tidak dibenarkan'
    })
  }

  try {
    // Sambung ke database
    await connectDB()

    // Dapatkan user ID dari token
    const userId = getUserFromToken(event)
    
    if (!userId) {
      return {
        success: false,
        message: 'Tidak log masuk'
      }
    }

    // Cari pengguna dalam database
    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return {
        success: false,
        message: 'Pengguna tidak dijumpai'
      }
    }

    // Return user data
    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        picture: user.picture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    }

  } catch (error) {
    console.error('Error dalam authentication check:', error)
    
    return {
      success: false,
      message: 'Ralat server dalam'
    }
  }
}) 