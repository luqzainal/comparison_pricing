// import { getServerSession } from '#auth'
import User from '~/server/models/User'
import Product from '~/server/models/Product'
import { isValidObjectId } from 'mongoose'

export default defineEventHandler(async (event) => {
  // Temporarily disable auth check
  // const session = await getServerSession(event)
  // if (!session) {
  //   throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  // }

  const body = await readBody(event)
  const { productId, targetPrice } = body

  // Validate input
  if (!productId || !targetPrice) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID and target price are required.' })
  }
  if (!isValidObjectId(productId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Product ID.' })
  }
  if (typeof targetPrice !== 'number' || targetPrice <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid target price.' })
  }

  // Check if product exists
  const productExists = await Product.findById(productId)
  if (!productExists) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found.' })
  }

  try {
    // For now, return success without actually setting alert
    // TODO: Re-enable when auth is restored
    return { success: true, message: 'Price alert set successfully (demo mode).' }
    
    // Original code commented out:
    // const user = await User.findOne({ email: session.user.email })
    // if (!user) {
    //   throw createError({ statusCode: 404, statusMessage: 'User not found.' })
    // }

    // const existingAlertIndex = user.priceAlerts.findIndex(
    //   (alert) => alert.productId.toString() === productId
    // )

    // if (existingAlertIndex > -1) {
    //   // Update existing alert
    //   user.priceAlerts[existingAlertIndex].targetPrice = targetPrice
    //   user.priceAlerts[existingAlertIndex].isActive = true
    // } else {
    //   // Add new alert
    //   user.priceAlerts.push({
    //     productId,
    //     targetPrice,
    //     isActive: true,
    //     createdAt: new Date(),
    //   })
    // }

    // await user.save()

    // return { success: true, message: 'Price alert set successfully.' }
  } catch (error) {
    console.error('Error setting price alert:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to set price alert.' })
  }
}) 