import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/database.js'
import { sendWelcomeEmail } from '~/server/utils/email.js'

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

    // Dapatkan token dari query parameter
    const query = getQuery(event)
    const { token } = query

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token pengesahan diperlukan'
      })
    }

    // Cari pengguna berdasarkan token
    const user = await User.findOne({ 
      emailVerificationToken: token,
      isVerified: false 
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Token tidak sah atau sudah tamat tempoh'
      })
    }

    // Update pengguna - sahkan e-mel dan buang token
    user.isVerified = true
    user.emailVerificationToken = undefined
    await user.save()

    // Hantar e-mel selamat datang
    try {
      await sendWelcomeEmail(user.email, user.name)
    } catch (emailError) {
      console.error('Ralat menghantar e-mel selamat datang:', emailError)
      // Jangan gagalkan verification jika e-mel gagal
    }

    // Return success response
    return {
      success: true,
      message: 'E-mel telah berjaya disahkan! Selamat datang ke Compare Harga.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    }

  } catch (error) {
    // Jika error sudah ada statusCode (dari createError), pass sahaja
    if (error.statusCode) {
      throw error
    }

    // Log error untuk debugging
    console.error('Error dalam pengesahan e-mel:', error)

    // Return error generik
    throw createError({
      statusCode: 500,
      statusMessage: 'Ralat server dalam'
    })
  }
}) 