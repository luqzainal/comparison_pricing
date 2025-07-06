import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/database.js'
import { 
  validateEmail, 
  generateRandomToken 
} from '~/server/utils/auth.js'
import { sendPasswordResetEmail } from '~/server/utils/email.js'

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
    const { email } = await readBody(event)

    // Validasi input
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Alamat e-mel diperlukan'
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
      // Jangan beri tahu jika akaun tidak wujud (untuk keselamatan)
      return {
        success: true,
        message: 'Jika akaun wujud, e-mel tetapan semula kata laluan telah dihantar.'
      }
    }

    // Periksa jika akaun sudah disahkan
    if (!user.isVerified) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Akaun belum disahkan. Sila sahkan e-mel anda terlebih dahulu.'
      })
    }

    // Generate token reset kata laluan
    const resetToken = generateRandomToken()
    
    // Set token dan expiry (1 jam dari sekarang)
    user.passwordResetToken = resetToken
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 jam
    await user.save()

    // Hantar e-mel reset kata laluan
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name)
    } catch (emailError) {
      console.error('Ralat menghantar e-mel reset kata laluan:', emailError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal menghantar e-mel reset kata laluan'
      })
    }

    // Return success response
    return {
      success: true,
      message: 'E-mel tetapan semula kata laluan telah dihantar. Sila semak peti masuk anda.'
    }

  } catch (error) {
    // Jika error sudah ada statusCode (dari createError), pass sahaja
    if (error.statusCode) {
      throw error
    }

    // Log error untuk debugging
    console.error('Error dalam permintaan reset kata laluan:', error)

    // Return error generik
    throw createError({
      statusCode: 500,
      statusMessage: 'Ralat server dalam'
    })
  }
}) 