// Sample product data with comprehensive specifications for testing
export const sampleProducts = [
  {
    _id: 'sample-iphone-15-pro',
    name: 'iPhone 15 Pro Max 256GB Titanium Natural',
    description: 'Latest iPhone with titanium design and advanced camera system',
    category: 'Smartphone',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895615329',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-back-select?wid=470&hei=556&fmt=png-alpha&.v=1692895616184'
    ],
    platforms: {
      shopee: {
        id: 'shopee-iphone15-pro',
        name: 'iPhone 15 Pro Max 256GB Natural Titanium',
        price: 5499,
        originalPrice: 5999,
        currency: 'RM',
        rating: 4.9,
        reviewCount: 1247,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895615329'
        ],
        link: 'https://shopee.com.my/iPhone-15-Pro-Max-256GB-i.123456789.987654321',
        affiliateId: 'shopee-aff-123',
        seller: {
          name: 'Apple Store Official',
          rating: 4.9,
          responseRate: 99,
          isVerified: true,
          isOfficialStore: true,
          followerCount: 89000,
          location: 'Kuala Lumpur'
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '1-2 hari',
          cost: 0
        },
        specifications: {
          display_size: '6.7 inci',
          resolution: '2796 x 1290 piksel',
          processor: 'A17 Pro chip',
          ram: '8GB',
          storage: '256GB',
          rear_camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          front_camera: '12MP TrueDepth',
          battery_capacity: '4441 mAh',
          operating_system: 'iOS 17',
          weight: '221g',
          dimensions: '159.9 x 76.7 x 8.25 mm',
          color: 'Natural Titanium',
          network: '5G',
          bluetooth: 'Bluetooth 5.3',
          wifi: 'Wi-Fi 6E',
          face_unlock: true,
          warranty: '1 tahun Apple',
          material: 'Grade 5 Titanium',
          water_resistance: 'IP68'
        }
      },
      lazada: {
        id: 'lazada-iphone15-pro',
        name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
        price: 5399,
        originalPrice: 5999,
        currency: 'RM',
        rating: 4.8,
        reviewCount: 943,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895615329'
        ],
        link: 'https://lazada.com.my/products/iphone-15-pro-max-256gb-i987654321.html',
        affiliateId: 'lazada-aff-456',
        seller: {
          name: 'Apple Official Store',
          rating: 4.8,
          responseRate: 97,
          isVerified: true,
          isOfficialStore: true,
          followerCount: 72000,
          location: 'Selangor'
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '2-3 hari',
          cost: 0
        },
        specifications: {
          display_size: '6.7 inch',
          resolution: '2796 x 1290 pixels',
          processor: 'A17 Pro chip',
          ram: '8GB',
          storage: '256GB',
          rear_camera: '48MP + 12MP + 12MP',
          front_camera: '12MP',
          battery_capacity: '4441mAh',
          operating_system: 'iOS 17',
          weight: '221 grams',
          dimensions: '159.9 x 76.7 x 8.25mm',
          color: 'Natural Titanium',
          network: '5G Ready',
          bluetooth: 'v5.3',
          wifi: 'Wi-Fi 6E',
          face_unlock: 'Yes',
          warranty: '12 months',
          material: 'Titanium Frame',
          water_resistance: 'IP68 Rating'
        }
      }
    }
  },
  {
    _id: 'sample-macbook-air-m3',
    name: 'MacBook Air 15-inch M3 Chip 512GB Starlight',
    description: 'Ultra-thin laptop with M3 chip for exceptional performance',
    category: 'Laptop',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-starlight-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1684340736301'
    ],
    platforms: {
      shopee: {
        id: 'shopee-macbook-air-m3',
        name: 'MacBook Air 15" M3 8GB 512GB SSD Starlight',
        price: 6999,
        originalPrice: 7499,
        currency: 'RM',
        rating: 4.7,
        reviewCount: 456,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-starlight-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1684340736301'
        ],
        link: 'https://shopee.com.my/MacBook-Air-15-M3-i.234567890.123456789',
        affiliateId: 'shopee-aff-123',
        seller: {
          name: 'Mac Store Malaysia',
          rating: 4.8,
          responseRate: 95,
          isVerified: true,
          isOfficialStore: false,
          followerCount: 23000,
          location: 'Petaling Jaya'
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '3-5 hari',
          cost: 0
        },
        specifications: {
          display_size: '15.3 inci',
          resolution: '2880 x 1864 piksel',
          processor: 'Apple M3 chip',
          cpu: '8-core CPU',
          gpu: '10-core GPU',
          ram: '8GB unified memory',
          storage: '512GB SSD',
          battery: 'Hingga 18 jam',
          weight: '1.51kg',
          dimensions: '34.04 x 23.76 x 1.15 cm',
          color: 'Starlight',
          ports: '2x Thunderbolt 3, 1x MagSafe 3, 1x 3.5mm',
          keyboard: 'Magic Keyboard dengan Touch ID',
          webcam: '1080p FaceTime HD',
          speakers: '6-speaker sound system',
          operating_system: 'macOS Sonoma',
          warranty: '1 tahun Apple'
        }
      },
      lazada: {
        id: 'lazada-macbook-air-m3',
        name: 'Apple MacBook Air 15-inch M3 Chip 512GB Starlight',
        price: 6899,
        originalPrice: 7299,
        currency: 'RM',
        rating: 4.9,
        reviewCount: 387,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-starlight-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1684340736301'
        ],
        link: 'https://lazada.com.my/products/macbook-air-15-m3-i345678901.html',
        affiliateId: 'lazada-aff-456',
        seller: {
          name: 'Apple Authorized Dealer',
          rating: 4.9,
          responseRate: 98,
          isVerified: true,
          isOfficialStore: true,
          followerCount: 45000,
          location: 'Kuala Lumpur'
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '1-3 hari',
          cost: 0
        },
        specifications: {
          display_size: '15.3 inch',
          resolution: '2880 x 1864 pixels',
          processor: 'M3 chip',
          cpu: '8-core CPU',
          gpu: '10-core GPU',
          ram: '8GB',
          storage: '512GB SSD',
          battery: 'Up to 18 hours',
          weight: '1.51 kg',
          dimensions: '340.4 x 237.6 x 11.5 mm',
          color: 'Starlight',
          ports: '2x Thunderbolt 3 (USB-C), MagSafe 3, 3.5mm headphone',
          keyboard: 'Magic Keyboard with Touch ID',
          webcam: '1080p FaceTime HD camera',
          speakers: 'Six-speaker system',
          operating_system: 'macOS Sonoma',
          warranty: '12 months Apple warranty'
        }
      }
    }
  },
  {
    _id: 'sample-sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Industry-leading wireless noise canceling headphones',
    category: 'Audio',
    images: [
      'https://www.sony.com.my/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF'
    ],
    platforms: {
      shopee: {
        id: 'shopee-sony-wh1000xm5',
        name: 'Sony WH-1000XM5 Wireless Headphones - Black',
        price: 1299,
        originalPrice: 1499,
        currency: 'RM',
        rating: 4.6,
        reviewCount: 789,
        images: [
          'https://www.sony.com.my/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF'
        ],
        link: 'https://shopee.com.my/Sony-WH-1000XM5-i.345678901.234567890',
        affiliateId: 'shopee-aff-123',
        seller: {
          name: 'Sony Official Store',
          rating: 4.7,
          responseRate: 94,
          isVerified: true,
          isOfficialStore: true,
          followerCount: 67000,
          location: 'Kuala Lumpur'
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '2-4 hari',
          cost: 0
        },
        specifications: {
          driver_size: '30mm',
          frequency_response: '4Hz-40kHz',
          impedance: '16Ω',
          connectivity: 'Bluetooth 5.2',
          noise_cancellation: 'Industry Leading ANC',
          playtime: '30 jam dengan ANC',
          charging_time: '3 jam (Quick charge: 3 min = 3 jam)',
          weight: '250g',
          color: 'Black',
          microphone: 'Built-in dual mic',
          controls: 'Touch sensor',
          codec: 'LDAC, AAC, SBC',
          warranty: '1 tahun Sony'
        }
      },
      lazada: {
        id: 'lazada-sony-wh1000xm5',
        name: 'Sony WH-1000XM5 Noise Cancelling Wireless Headphones',
        price: 1249,
        originalPrice: 1399,
        currency: 'RM',
        rating: 4.8,
        reviewCount: 623,
        images: [
          'https://www.sony.com.my/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF'
        ],
        link: 'https://lazada.com.my/products/sony-wh-1000xm5-i456789012.html',
        affiliateId: 'lazada-aff-456',
        seller: {
          name: 'Sony Store Malaysia',
          rating: 4.8,
          responseRate: 96,
          isVerified: true,
          isOfficialStore: true,
          followerCount: 78000,
          location: 'Selangor'
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '1-2 hari',
          cost: 0
        },
        specifications: {
          driver_size: '30mm drivers',
          frequency_response: '4Hz - 40kHz',
          impedance: '16 ohms',
          connectivity: 'Bluetooth v5.2',
          noise_cancellation: 'Adaptive Noise Cancelling',
          playtime: '30 hours (ANC ON)',
          charging_time: '3 hours full charge',
          weight: '250 grams',
          color: 'Midnight Black',
          microphone: 'Dual noise sensor technology',
          controls: 'Touch control panel',
          codec: 'Hi-Res Audio LDAC',
          warranty: '12 months official warranty'
        }
      }
    }
  }
]

export const getRandomProducts = (count = 3) => {
  const shuffled = [...sampleProducts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getProductById = (id) => {
  return sampleProducts.find(product => product._id === id)
} 