// Image optimization and lazy loading utilities

/**
 * Preloads an image by creating a new Image object and setting its src
 * @param {string} src - The image source URL
 * @returns {Promise<HTMLImageElement>} Promise that resolves when image is loaded
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preloads multiple images concurrently
 * @param {string[]} srcArray - Array of image source URLs
 * @returns {Promise<HTMLImageElement[]>} Promise that resolves when all images are loaded
 */
export function preloadImages(srcArray) {
  return Promise.all(srcArray.map(src => preloadImage(src)));
}

/**
 * Validates if an image URL is accessible and returns a valid image
 * @param {string} src - The image source URL
 * @param {string} fallbackSrc - Fallback image URL if main src fails
 * @returns {Promise<string>} Promise that resolves to a valid image URL
 */
export async function validateImageUrl(src, fallbackSrc = '/images/placeholder.jpg') {
  try {
    await preloadImage(src);
    return src;
  } catch (_error) {
    console.warn(`Image failed to load: ${src}, using fallback`);
    return fallbackSrc;
  }
}

/**
 * Creates a placeholder image data URL with specified dimensions and color
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @param {string} bgColor - Background color in hex format (default: #f0f0f0)
 * @param {string} textColor - Text color in hex format (default: #999)
 * @returns {string} Data URL for the placeholder image
 */
export function createPlaceholderDataUrl(width = 300, height = 300, bgColor = '#f0f0f0', textColor = '#999') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = textColor;
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${width}x${height}`, width / 2, height / 2);
  
  return canvas.toDataURL();
}

/**
 * Optimizes image URL by adding query parameters for resizing
 * Works with services like Shopee and Lazada that support URL-based resizing
 * @param {string} src - Original image URL
 * @param {number} _width - Desired width (currently unused)
 * @param {number} _height - Desired height (currently unused)
 * @param {string} _quality - Image quality (currently unused)
 * @returns {string} Optimized image URL
 */
export function optimizeImageUrl(src, _width = 300, _height = 300, _quality = 'high') {
  if (!src) return '';
  
  // For Shopee images
  if (src.includes('cf.shopee.com.my')) {
    return `${src}_tn`;
  }
  
  // For Lazada images
  if (src.includes('lzd-img-global.slatic.net')) {
    return `${src}?w=${_width}&h=${_height}&q=${_quality}`;
  }
  
  // For other images, return as-is
  return src;
}

/**
 * Intersection Observer setup for lazy loading images
 * @param {string} selector - CSS selector for images to lazy load
 * @param {Object} options - Intersection Observer options
 */
export function setupLazyLoading(selector = 'img[data-src]', options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  }, defaultOptions);

  // Observe all images matching the selector
  document.querySelectorAll(selector).forEach(img => {
    imageObserver.observe(img);
  });

  return imageObserver;
}

/**
 * Compresses an image file using canvas
 * @param {File} file - The image file to compress
 * @param {number} quality - Compression quality (0-1)
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} Promise that resolves to compressed image blob
 */
export function compressImage(file, quality = 0.8, maxWidth = 1200, maxHeight = 1200) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
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