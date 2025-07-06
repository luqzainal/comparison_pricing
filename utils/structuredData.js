export function generateWebsiteSchema(config) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CompareHarga',
    description: 'Platform perbandingan harga terbaik untuk membantu anda menjimatkan wang dengan membandingkan harga produk di Shopee dan Lazada',
    url: config.public.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.public.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateOrganizationSchema(config) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CompareHarga',
    url: config.public.siteUrl,
    logo: `${config.public.siteUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/compareharga',
      'https://twitter.com/compareharga'
    ]
  }
}

/**
 * Generates structured data for product pages
 * @param {Object} product - Product data
 * @returns {Object} JSON-LD structured data
 */
export function generateProductStructuredData(product) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.images?.[0] || '',
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Unknown'
    },
    offers: []
  }

  // Add Shopee offer if available
  if (product.platforms?.shopee) {
    structuredData.offers.push({
      '@type': 'Offer',
      price: product.platforms.shopee.price,
      priceCurrency: 'MYR',
      availability: product.platforms.shopee.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.platforms.shopee.seller?.name || 'Shopee Seller'
      },
      url: product.platforms.shopee.url
    })
  }

  // Add Lazada offer if available
  if (product.platforms?.lazada) {
    structuredData.offers.push({
      '@type': 'Offer',
      price: product.platforms.lazada.price,
      priceCurrency: 'MYR',
      availability: product.platforms.lazada.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.platforms.lazada.seller?.name || 'Lazada Seller'
      },
      url: product.platforms.lazada.url
    })
  }

  return structuredData
}

export function generateBreadcrumbSchema(breadcrumbs, config) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${config.public.siteUrl}${item.url}`
    }))
  }
} 