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

export function generateProductSchema(product, config) {
  const offers = []
  
  if (product.platforms?.shopee?.price) {
    offers.push({
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
  
  if (product.platforms?.lazada?.price) {
    offers.push({
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

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    category: product.category,
    offers: offers,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.bestPrice?.rating || 0,
      reviewCount: product.bestPrice?.reviewCount || 0
    }
  }
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