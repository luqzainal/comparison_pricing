import { clearAuthCookie } from '~/server/utils/auth.js'

export default defineEventHandler(async (event) => {
  // Hanya terima POST request
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method tidak dibenarkan'
    })
  }

  try {
    // Clear auth cookie
    clearAuthCookie(event)

    return {
      success: true,
      message: 'Log keluar berjaya'
    }

  } catch (error) {
    console.error('Error dalam log keluar:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Ralat server dalam'
    })
  }
}) 