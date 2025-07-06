import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/database.js'
import { 
  hashPassword, 
  validateEmail, 
  validatePassword, 
  validateRecaptcha, 
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
    const { name, email, password, recaptchaToken } = await readBody(event)

    // Validasi input
    if (!name || !email || !password || !recaptchaToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Semua medan diperlukan'
      })
    }

    // Validasi nama
    if (name.trim().length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama mesti sekurang-kurangnya 2 aksara'
      })
    }

    // Validasi e-mel
    if (!validateEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format e-mel tidak sah'
      })
    }

    // Validasi kata laluan
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      throw createError({
        statusCode: 400,
        statusMessage: passwordValidation.message
      })
    }

    // Validasi reCAPTCHA
    const recaptchaValidation = await validateRecaptcha(recaptchaToken, event)
    if (!recaptchaValidation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pengesahan reCAPTCHA gagal'
      })
    }

    // Periksa jika e-mel sudah wujud
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'E-mel sudah didaftarkan'
      })
    }

    // Hash kata laluan
    const hashedPassword = await hashPassword(password)

    // Generate token untuk pengesahan e-mel
    const emailVerificationToken = generateRandomToken()

    // Periksa jika ini adalah pengguna pertama (akan jadi admin)
    const userCount = await User.countDocuments()
    const isFirstUser = userCount === 0

    // Buat pengguna baru
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isFirstUser ? 'admin' : 'user',
      isVerified: false,
      emailVerificationToken,
      createdAt: new Date(),
      lastLogin: new Date()
    })

    // Simpan pengguna
    await newUser.save()

    // Hantar e-mel pengesahan
    try {
      await sendVerificationEmail(email, emailVerificationToken, name)
    } catch (emailError) {
      console.error('Ralat menghantar e-mel:', emailError)
      // Jangan gagalkan pendaftaran jika e-mel gagal
    }

    // Return response berjaya
    return {
      success: true,
      message: isFirstUser 
        ? 'Akaun admin telah berjaya didaftarkan! Sila semak e-mel untuk pengesahan.'
        : 'Akaun telah berjaya didaftarkan! Sila semak e-mel untuk pengesahan.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      }
    }

  } catch (error) {
    // Jika error sudah ada statusCode (dari createError), pass sahaja
    if (error.statusCode) {
      throw error
    }

    // Log error untuk debugging
    console.error('Error dalam pendaftaran:', error)

    // Return error generik
    throw createError({
      statusCode: 500,
      statusMessage: 'Ralat server dalam'
    })
  }
}) 