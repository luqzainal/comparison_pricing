// Image preloading utilities
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Preload multiple images
export const preloadImages = async (imageUrls) => {
  try {
    const promises = imageUrls.map(url => preloadImage(url))
    const results = await Promise.allSettled(promises)
    return results.map((result, index) => ({
      url: imageUrls[index],
      success: result.status === 'fulfilled'
    }))
  } catch (error) {
    console.error('Error preloading images:', error)
    return []
  }
}

// Generate optimized image URL (for future integration with image CDN)
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  const { width = 400, height = 300, quality = 80 } = options
  
  // For now, return original URL
  // In future, this can be enhanced to work with image CDN services
  if (!originalUrl) return null
  
  // Basic URL validation
  try {
    new URL(originalUrl)
    return originalUrl
  } catch {
    return null
  }
}

// Check if image URL is valid
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// Generate placeholder image URL
export const getPlaceholderImageUrl = (width = 400, height = 300) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
        Memuat gambar...
      </text>
    </svg>
  `)}`
}

// Image size optimization recommendations
export const getImageSizeRecommendations = (containerWidth, containerHeight, devicePixelRatio = 1) => {
  const scaleFactor = Math.min(devicePixelRatio, 2) // Cap at 2x for performance
  
  return {
    width: Math.round(containerWidth * scaleFactor),
    height: Math.round(containerHeight * scaleFactor),
    quality: devicePixelRatio > 1 ? 85 : 80
  }
} 