import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// JWT secret key - dalam production, gunakan variable environment
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Hash password menggunakan bcrypt
export async function hashPassword(password) {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Generate random token untuk email verification dan password reset
export function generateRandomToken() {
  return crypto.randomBytes(32).toString('hex')
}

// Get user dari JWT token dalam request
export function getUserFromToken(event) {
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  const decoded = verifyToken(token)
  return decoded ? decoded.userId : null
}

// Set auth cookie
export function setAuthCookie(event, token) {
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

// Clear auth cookie
export function clearAuthCookie(event) {
  deleteCookie(event, 'auth-token')
}

// Validate email format
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Kata laluan mesti sekurang-kurangnya 8 aksara' }
  }
  
  return { valid: true }
}

// Validate reCAPTCHA
export async function validateRecaptcha(token, event = null) {
  let secretKey = process.env.RECAPTCHA_SECRET_KEY
  
  // Jika dipanggil dari dalam API route, cuba dapatkan dari runtimeConfig
  if (event && !secretKey) {
    try {
      const config = useRuntimeConfig()
      secretKey = config.recaptchaSecretKey
    } catch (error) {
      // Ignore error if useRuntimeConfig not available
    }
  }
  
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY tidak ditetapkan')
    return { success: true } // Skip validation jika tidak ditetapkan
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`
    })
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error validating reCAPTCHA:', error)
    return { success: false }
  }
} 