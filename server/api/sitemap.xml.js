import connectDB from '../utils/database.js'
import Product from '../models/Product.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  try {
    await connectDB()
    
    // Get all active products
    const products = await Product.find({ isActive: true })
      .select('_id updatedAt')
      .sort({ updatedAt: -1 })
      .limit(1000) // Limit to latest 1000 products

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Product Pages -->
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml')
    return sitemap
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return basic sitemap if database error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
    
    setHeader(event, 'Content-Type', 'application/xml')
    return basicSitemap
  }
}) 