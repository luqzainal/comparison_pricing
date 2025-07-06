import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/database.js'
import { 
  validatePassword, 
  hashPassword 
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
    const { token, password, confirmPassword } = await readBody(event)

    // Validasi input
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token reset diperlukan'
      })
    }

    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kata laluan diperlukan'
      })
    }

    if (!confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pengesahan kata laluan diperlukan'
      })
    }

    // Validasi kata laluan
    if (!validatePassword(password)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kata laluan mestilah sekurang-kurangnya 8 aksara'
      })
    }

    // Periksa jika kata laluan dan pengesahan sama
    if (password !== confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kata laluan dan pengesahan tidak sepadan'
      })
    }

    // Cari pengguna berdasarkan token dan periksa expiry
    const user = await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() } // Token belum expired
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token tidak sah atau sudah tamat tempoh'
      })
    }

    // Hash kata laluan baru
    const hashedPassword = await hashPassword(password)

    // Update kata laluan dan buang token reset
    user.password = hashedPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // Return success response
    return {
      success: true,
      message: 'Kata laluan telah berjaya ditetapkan semula. Anda boleh log masuk dengan kata laluan baru.'
    }

  } catch (error) {
    // Jika error sudah ada statusCode (dari createError), pass sahaja
    if (error.statusCode) {
      throw error
    }

    // Log error untuk debugging
    console.error('Error dalam reset kata laluan:', error)

    // Return error generik
    throw createError({
      statusCode: 500,
      statusMessage: 'Ralat server dalam'
    })
  }
}) 