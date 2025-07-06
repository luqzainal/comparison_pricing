import Product from '~/server/models/Product'
import connectDB from '~/server/utils/database'
import { getRandomProducts, sampleProducts } from '~/utils/sampleProducts'

export default defineEventHandler(async (event) => {
  try {
    // Try to connect to database
    let useDatabase = true
    try {
      await connectDB()
    } catch (dbError) {
      console.warn('Database not available, using sample data:', dbError.message)
      useDatabase = false
    }

    const query = getQuery(event)
    const {
      q = '',           // search query
      page = 1,         // current page
      limit = 12,       // items per page
      sortBy = 'relevance', // sort type
      platforms = '',   // platform filter (shopee, lazada, atau kosong untuk semua)
      minPrice = 0,     // minimum price
      maxPrice = 999999, // maximum price
      location = '',    // location filter
      category = '',    // category filter
      brand = '',       // brand filter
      rating = 0        // minimum rating
    } = query

    // Build search criteria
    const searchCriteria = {
      isActive: true
    }

    // Text search
    if (q && q.trim()) {
      searchCriteria.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { searchKeywords: { $in: [new RegExp(q.trim(), 'i')] } },
        { category: { $regex: q.trim(), $options: 'i' } },
        { brand: { $regex: q.trim(), $options: 'i' } }
      ]
    }

    // Price range filter
    const priceFilter = {}
    if (Number(minPrice) > 0 || Number(maxPrice) < 999999) {
      priceFilter['bestPrice.price'] = {}
      if (Number(minPrice) > 0) priceFilter['bestPrice.price'].$gte = Number(minPrice)
      if (Number(maxPrice) < 999999) priceFilter['bestPrice.price'].$lte = Number(maxPrice)
      Object.assign(searchCriteria, priceFilter)
    }

    // Platform filter
    if (platforms && platforms.trim()) {
      const platformList = platforms.split(',').filter(p => ['shopee', 'lazada'].includes(p));
      if (platformList.length > 0) {
        searchCriteria['platforms.platform'] = { $in: platformList };
      }
    }

    // Location filter
    if (location && location.trim()) {
      const locationRegex = new RegExp(location.trim(), 'i');
      searchCriteria['platforms.seller.location'] = locationRegex;
    }

    // Category filter
    if (category && category.trim()) {
      searchCriteria.category = { $regex: category.trim(), $options: 'i' }
    }

    // Brand filter
    if (brand && brand.trim()) {
      searchCriteria.brand = { $regex: brand.trim(), $options: 'i' }
    }

    // Rating filter
    if (Number(rating) > 0) {
      searchCriteria.$or = searchCriteria.$or || []
      searchCriteria.$or.push(
        { 'platforms.shopee.rating': { $gte: Number(rating) } },
        { 'platforms.lazada.rating': { $gte: Number(rating) } }
      )
    }

    // Build sort criteria
    let sortCriteria = {}
    switch (sortBy) {
      case 'price-asc':
        sortCriteria = { 'bestPrice.price': 1 }
        break
      case 'price-desc':
        sortCriteria = { 'bestPrice.price': -1 }
        break
      case 'rating':
        // Sort by highest rating from either platform
        sortCriteria = { 'platforms.shopee.rating': -1, 'platforms.lazada.rating': -1 }
        break
      case 'popularity':
        // Assuming popularity is based on reviewCount
        sortCriteria = { 'platforms.shopee.reviewCount': -1, 'platforms.lazada.reviewCount': -1 }
        break
      case 'newest':
        sortCriteria = { createdAt: -1 }
        break
      case 'relevance':
      default:
        // For text search, sort by text score, otherwise by best price
        if (q && q.trim()) {
          searchCriteria.$text = { $search: q.trim() }
          sortCriteria = { score: { $meta: 'textScore' } }
        } else {
          sortCriteria = { 'bestPrice.price': 1 }
        }
        break
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))) // Max 50 items per page
    const skip = (pageNum - 1) * limitNum

    let products, totalCount

    if (useDatabase) {
      // Execute search with pagination using database
      const [dbProducts, dbTotalCount] = await Promise.all([
        Product.find(searchCriteria)
          .sort(sortCriteria)
          .skip(skip)
          .limit(limitNum)
          .select({
            name: 1,
            description: 1,
            category: 1,
            brand: 1,
            images: 1,
            platforms: 1,
            bestPrice: 1,
            createdAt: 1,
            updatedAt: 1
          })
          .lean(),
        Product.countDocuments(searchCriteria)
      ])
      products = dbProducts
      totalCount = dbTotalCount
    } else {
      // Use sample data for development
      let mockProducts = [...sampleProducts]
      
      // Filter by search query if provided
      if (q && q.trim() !== '') {
        const searchTerm = q.toLowerCase().trim()
        mockProducts = mockProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        )
      }
      
      // Filter by category if provided
      if (category && category !== '') {
        mockProducts = mockProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        )
      }
      
      // Filter by price range if provided
      if (Number(minPrice) > 0 || Number(maxPrice) < 999999) {
        mockProducts = mockProducts.filter(product => {
          const shopeePrice = product.platforms?.shopee?.price || 999999
          const lazadaPrice = product.platforms?.lazada?.price || 999999
          const minPlatformPrice = Math.min(shopeePrice, lazadaPrice)
          
          return minPlatformPrice >= Number(minPrice) && minPlatformPrice <= Number(maxPrice)
        })
      }
      
      // Filter by platforms if provided
      if (platforms && platforms.trim()) {
        const platformList = platforms.split(',');
        if (platformList.length > 0) {
          mockProducts = mockProducts.filter(p => 
            platformList.some(platform => p.platforms[platform])
          );
        }
      }
      
      // Filter by location
      if (location && location.trim()) {
        const searchLoc = location.toLowerCase().trim();
        mockProducts = mockProducts.filter(p => {
          const shopeeLoc = p.platforms?.shopee?.seller?.location?.toLowerCase() || '';
          const lazadaLoc = p.platforms?.lazada?.seller?.location?.toLowerCase() || '';
          return shopeeLoc.includes(searchLoc) || lazadaLoc.includes(searchLoc);
        });
      }
      
      // Filter by category if provided
      if (category && category !== '') {
        mockProducts = mockProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        )
      }
      
      // Sort products
      if (sortBy === 'price-asc') {
        mockProducts.sort((a, b) => {
          const priceA = Math.min(a.platforms?.shopee?.price || 999999, a.platforms?.lazada?.price || 999999)
          const priceB = Math.min(b.platforms?.shopee?.price || 999999, b.platforms?.lazada?.price || 999999)
          return priceA - priceB
        })
      } else if (sortBy === 'price-desc') {
        mockProducts.sort((a, b) => {
          const priceA = Math.min(a.platforms?.shopee?.price || 0, a.platforms?.lazada?.price || 0)
          const priceB = Math.min(b.platforms?.shopee?.price || 0, b.platforms?.lazada?.price || 0)
          return priceB - priceA
        })
      } else if (sortBy === 'rating') {
        mockProducts.sort((a, b) => {
          const ratingA = Math.max(a.platforms?.shopee?.rating || 0, a.platforms?.lazada?.rating || 0)
          const ratingB = Math.max(b.platforms?.shopee?.rating || 0, b.platforms?.lazada?.rating || 0)
          return ratingB - ratingA
        })
      } else if (sortBy === 'popularity') {
         mockProducts.sort((a, b) => {
          const popA = Math.max(a.platforms?.shopee?.reviewCount || 0, a.platforms?.lazada?.reviewCount || 0)
          const popB = Math.max(b.platforms?.shopee?.reviewCount || 0, b.platforms?.lazada?.reviewCount || 0)
          return popB - popA
        })
      }
      
      // Apply pagination
      totalCount = mockProducts.length
      products = mockProducts.slice(skip, skip + limitNum)
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum)
    const hasNextPage = pageNum < totalPages
    const hasPrevPage = pageNum > 1

    // Format response
    const response = {
      success: true,
      data: {
        products: products.map(product => {
          // Handle both database format and sample data format
          const isFromSample = !product.bestPrice
          
          if (isFromSample) {
            // Format sample data to match expected structure
            return {
              _id: product._id,
              name: product.name,
              description: product.description,
              category: product.category,
              brand: product.brand || 'Unknown',
              images: product.images || [],
              platforms: product.platforms,
              bestPrice: {
                platform: product.platforms?.shopee?.price <= product.platforms?.lazada?.price ? 'shopee' : 'lazada',
                price: Math.min(product.platforms?.shopee?.price || 999999, product.platforms?.lazada?.price || 999999)
              },
              createdAt: new Date(),
              updatedAt: new Date()
            }
          } else {
            // Database format
            return {
              _id: product._id,
              name: product.name,
              description: product.description,
              category: product.category,
              brand: product.brand,
              images: product.images || [],
              platforms: {
                shopee: product.platforms?.shopee ? {
                  url: product.platforms.shopee.url,
                  price: product.platforms.shopee.price,
                  originalPrice: product.platforms.shopee.originalPrice,
                  discount: product.platforms.shopee.discount,
                  rating: product.platforms.shopee.rating,
                  reviewCount: product.platforms.shopee.reviewCount,
                  seller: product.platforms.shopee.seller,
                  stock: product.platforms.shopee.stock
                } : null,
                lazada: product.platforms?.lazada ? {
                  url: product.platforms.lazada.url,
                  price: product.platforms.lazada.price,
                  originalPrice: product.platforms.lazada.originalPrice,
                  discount: product.platforms.lazada.discount,
                  rating: product.platforms.lazada.rating,
                  reviewCount: product.platforms.lazada.reviewCount,
                  seller: product.platforms.lazada.seller,
                  stock: product.platforms.lazada.stock
                } : null
              },
              bestPrice: product.bestPrice,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt
            }
          }
        }),
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        },
        searchInfo: {
          query: q,
          filters: {
            platforms,
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            location,
            rating: Number(rating)
          },
          sort: sortBy
        }
      }
    }

    return response

  } catch (error) {
    console.error('Search API error:', error)
    
    return {
      success: false,
      error: {
        message: 'Ralat semasa mencari produk',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    }
  }
}) 