import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/database.js'
import { 
  verifyPassword, 
  validateEmail, 
  generateToken, 
  setAuthCookie 
} from '~/server/utils/auth.js'

export default defineEventHandler(async (event) => {
  // Hanya terima POST request
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method tidak dibenarkan'
    })
  }

  try {
    // Sambung ke database
    await connectDB()

    // Dapatkan data dari request body
    const { email, password } = await readBody(event)

    // Validasi input
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'E-mel dan kata laluan diperlukan'
      })
    }

    // Validasi format e-mel
    if (!validateEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format e-mel tidak sah'
      })
    }

    // Cari pengguna berdasarkan e-mel
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'E-mel atau kata laluan tidak tepat'
      })
    }

    // Verify kata laluan
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'E-mel atau kata laluan tidak tepat'
      })
    }

    // Periksa jika akaun sudah disahkan
    if (!user.isVerified) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Akaun belum disahkan. Sila semak e-mel untuk pautan pengesahan.'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    })

    // Set auth cookie
    setAuthCookie(event, token)

    // Return user data (tanpa kata laluan)
    return {
      success: true,
      message: 'Log masuk berjaya',
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
    // Jika error sudah ada statusCode (dari createError), pass sahaja
    if (error.statusCode) {
      throw error
    }

    // Log error untuk debugging
    console.error('Error dalam log masuk:', error)

    // Return error generik
    throw createError({
      statusCode: 500,
      statusMessage: 'Ralat server dalam'
    })
  }
}) 