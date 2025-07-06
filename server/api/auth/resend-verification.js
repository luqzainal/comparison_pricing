import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/database.js'
import { 
  validateEmail, 
  generateRandomToken 
} from '~/server/utils/auth.js'
import { sendVerificationEmail } from '~/server/utils/email.js'

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
      throw createError({
        statusCode: 404,
        statusMessage: 'Akaun tidak dijumpai'
      })
    }

    // Periksa jika akaun sudah disahkan
    if (user.isVerified) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Akaun sudah disahkan'
      })
    }

    // Generate token pengesahan baru
    const newVerificationToken = generateRandomToken()
    
    // Update pengguna dengan token baru
    user.emailVerificationToken = newVerificationToken
    await user.save()

    // Hantar e-mel pengesahan baru
    try {
      await sendVerificationEmail(user.email, newVerificationToken, user.name)
    } catch (emailError) {
      console.error('Ralat menghantar e-mel pengesahan:', emailError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal menghantar e-mel pengesahan'
      })
    }

    // Return success response
    return {
      success: true,
      message: 'E-mel pengesahan telah dihantar semula. Sila semak peti masuk anda.'
    }

  } catch (error) {
    // Jika error sudah ada statusCode (dari createError), pass sahaja
    if (error.statusCode) {
      throw error
    }

    // Log error untuk debugging
    console.error('Error dalam menghantar semula e-mel pengesahan:', error)

    // Return error generik
    throw createError({
      statusCode: 500,
      statusMessage: 'Ralat server dalam'
    })
  }
}) 