<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
    <!-- Product Image with Lazy Loading & Carousel -->
    <div class="relative h-48 bg-gray-100 overflow-hidden group">
      <!-- Image Carousel -->
      <div v-if="validImages.length > 0" class="relative w-full h-full">
        <!-- Main Image -->
        <div class="w-full h-full relative">
          <img
            v-show="!imageLoading && !imageError"
            :src="currentImage"
            :alt="product.name"
            class="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            @load="handleImageLoad"
            @error="handleImageError"
          />
          
          <!-- Image Loading Placeholder -->
          <div v-show="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div class="flex flex-col items-center space-y-2">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="text-xs text-gray-500">Memuat gambar...</span>
            </div>
          </div>
          
          <!-- Image Error Placeholder -->
          <div v-show="imageError" class="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div class="flex flex-col items-center space-y-2 text-gray-400">
              <PhotoIcon class="h-12 w-12" />
              <span class="text-xs">Gambar tidak tersedia</span>
            </div>
          </div>
        </div>

        <!-- Image Navigation (for multiple images) -->
        <div 
          v-if="validImages.length > 1" 
          class="absolute inset-0"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- Previous Button -->
          <button
            v-show="currentImageIndex > 0"
            @click="previousImage"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70 z-10"
            aria-label="Gambar sebelumnya"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          
          <!-- Next Button -->
          <button
            v-show="currentImageIndex < validImages.length - 1"
            @click="nextImage"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70 z-10"
            aria-label="Gambar seterusnya"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Image Indicators -->
        <div v-if="validImages.length > 1" class="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div class="flex space-x-1">
            <button
              v-for="(image, index) in validImages"
              :key="index"
              @click="setCurrentImage(index)"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentImageIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              ]"
            />
          </div>
        </div>
      </div>

      <!-- No Image Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <div class="flex flex-col items-center space-y-2">
          <PhotoIcon class="h-16 w-16" />
          <span class="text-sm">Tiada gambar</span>
        </div>
      </div>
      
      <!-- Overall Best Price Badge -->
      <div v-if="bestPlatform" class="absolute top-2 left-2">
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
          <span class="mr-1">⚡</span>
          HARGA TERBAIK
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Product Name & Category -->
      <div class="mb-3">
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
          {{ product.name }}
        </h3>
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span>{{ product.category }}</span>
          <span>•</span>
          <span>{{ product.brand }}</span>
        </div>
      </div>

      <!-- Price Comparison -->
      <div class="mb-4 space-y-3">
        <!-- Shopee Price -->
        <div v-if="product.platforms?.shopee" 
             :class="[
               'flex items-center justify-between p-3 rounded-lg border relative',
               isBestPrice('shopee') 
                 ? 'bg-green-50 border-green-300 ring-2 ring-green-200' 
                 : 'bg-orange-50 border-orange-100'
             ]">
          <!-- Best Price Badge -->
          <div v-if="isBestPrice('shopee')" class="absolute -top-2 -left-2">
            <div class="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center">
              <span class="mr-1">👑</span>
              TERBAIK
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center',
              isBestPrice('shopee') ? 'bg-green-600' : 'bg-orange-500'
            ]">
              S
            </div>
            <div>
              <div class="text-sm font-medium text-gray-700">Shopee</div>
              <div class="flex items-center space-x-2">
                <span :class="[
                  'text-lg font-bold',
                  isBestPrice('shopee') ? 'text-green-700' : 'text-orange-600'
                ]">
                  RM {{ formatPrice(product.platforms.shopee.price) }}
                </span>
                <span v-if="product.platforms.shopee.originalPrice && product.platforms.shopee.originalPrice > product.platforms.shopee.price" 
                      class="text-sm text-gray-500 line-through">
                  RM {{ formatPrice(product.platforms.shopee.originalPrice) }}
                </span>
                <!-- Discount Badge -->
                <span v-if="getDiscountPercentage('shopee') > 0"
                      class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                  -{{ getDiscountPercentage('shopee') }}%
                </span>
              </div>
            </div>
          </div>
          <div class="text-right min-w-0 flex-1">
            <!-- Product Rating -->
            <div class="flex items-center justify-end space-x-1 text-sm text-gray-600 mb-1">
              <StarIcon class="h-4 w-4 text-yellow-400 fill-current flex-shrink-0" />
              <span class="font-medium">{{ product.platforms.shopee.rating }}</span>
              <span class="text-gray-400">({{ formatNumber(product.platforms.shopee.reviewCount) }})</span>
            </div>
            
            <!-- Seller Information -->
            <div class="text-right">
              <div class="flex items-center justify-end space-x-1 mb-1">
                <span class="text-xs font-medium text-gray-700 truncate max-w-24" :title="product.platforms.shopee.seller?.name">
                  {{ product.platforms.shopee.seller?.name }}
                </span>
                <div v-if="product.platforms.shopee.seller?.verified" class="flex-shrink-0">
                  <div class="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center">
                    <svg class="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Verified
                  </div>
                </div>
              </div>
              
                             <!-- Seller Stats -->
               <div class="space-y-1">
                 <div class="flex items-center justify-end space-x-2 text-xs text-gray-500">
                   <div v-if="product.platforms.shopee.seller?.rating" class="flex items-center space-x-1">
                     <span>Penjual:</span>
                     <StarIcon class="h-3 w-3 text-yellow-400 fill-current" />
                     <span class="font-medium">{{ product.platforms.shopee.seller.rating }}</span>
                   </div>
                   <div v-if="product.platforms.shopee.seller?.location" class="truncate max-w-20" :title="product.platforms.shopee.seller.location">
                     📍 {{ product.platforms.shopee.seller.location }}
                   </div>
                 </div>
                 
                 <!-- Shipping Info -->
                 <div v-if="product.platforms.shopee.shipping" class="flex items-center justify-end space-x-1 text-xs text-gray-500">
                   <span>🚚</span>
                   <span v-if="product.platforms.shopee.shipping.freeShipping" class="text-green-600 font-medium">
                     Penghantaran Percuma
                   </span>
                   <span v-else-if="product.platforms.shopee.shipping.cost" class="font-medium">
                     RM {{ formatPrice(product.platforms.shopee.shipping.cost) }}
                   </span>
                   <span v-if="product.platforms.shopee.shipping.estimatedDays" class="text-gray-400">
                     | {{ product.platforms.shopee.shipping.estimatedDays }} hari
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Lazada Price -->
        <div v-if="product.platforms?.lazada" 
             :class="[
               'flex items-center justify-between p-3 rounded-lg border relative',
               isBestPrice('lazada') 
                 ? 'bg-green-50 border-green-300 ring-2 ring-green-200' 
                 : 'bg-blue-50 border-blue-100'
             ]">
          <!-- Best Price Badge -->
          <div v-if="isBestPrice('lazada')" class="absolute -top-2 -left-2">
            <div class="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center">
              <span class="mr-1">👑</span>
              TERBAIK
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center',
              isBestPrice('lazada') ? 'bg-green-600' : 'bg-blue-500'
            ]">
              L
            </div>
            <div>
              <div class="text-sm font-medium text-gray-700">Lazada</div>
              <div class="flex items-center space-x-2">
                <span :class="[
                  'text-lg font-bold',
                  isBestPrice('lazada') ? 'text-green-700' : 'text-blue-600'
                ]">
                  RM {{ formatPrice(product.platforms.lazada.price) }}
                </span>
                <span v-if="product.platforms.lazada.originalPrice && product.platforms.lazada.originalPrice > product.platforms.lazada.price" 
                      class="text-sm text-gray-500 line-through">
                  RM {{ formatPrice(product.platforms.lazada.originalPrice) }}
                </span>
                <!-- Discount Badge -->
                <span v-if="getDiscountPercentage('lazada') > 0"
                      class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                  -{{ getDiscountPercentage('lazada') }}%
                </span>
              </div>
            </div>
          </div>
          <div class="text-right min-w-0 flex-1">
            <!-- Product Rating -->
            <div class="flex items-center justify-end space-x-1 text-sm text-gray-600 mb-1">
              <StarIcon class="h-4 w-4 text-yellow-400 fill-current flex-shrink-0" />
              <span class="font-medium">{{ product.platforms.lazada.rating }}</span>
              <span class="text-gray-400">({{ formatNumber(product.platforms.lazada.reviewCount) }})</span>
            </div>
            
            <!-- Seller Information -->
            <div class="text-right">
              <div class="flex items-center justify-end space-x-1 mb-1">
                <span class="text-xs font-medium text-gray-700 truncate max-w-24" :title="product.platforms.lazada.seller?.name">
                  {{ product.platforms.lazada.seller?.name }}
                </span>
                <div v-if="product.platforms.lazada.seller?.verified" class="flex-shrink-0">
                  <div class="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center">
                    <svg class="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Verified
                  </div>
                </div>
                <div v-if="product.platforms.lazada.seller?.isOfficial" class="flex-shrink-0">
                  <div class="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center">
                    <svg class="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Official
                  </div>
                </div>
              </div>
              
                             <!-- Seller Stats -->
               <div class="space-y-1">
                 <div class="flex items-center justify-end space-x-2 text-xs text-gray-500">
                   <div v-if="product.platforms.lazada.seller?.rating" class="flex items-center space-x-1">
                     <span>Penjual:</span>
                     <StarIcon class="h-3 w-3 text-yellow-400 fill-current" />
                     <span class="font-medium">{{ product.platforms.lazada.seller.rating }}</span>
                   </div>
                   <div v-if="product.platforms.lazada.seller?.location" class="truncate max-w-20" :title="product.platforms.lazada.seller.location">
                     📍 {{ product.platforms.lazada.seller.location }}
                   </div>
                 </div>
                 
                 <!-- Shipping Info -->
                 <div v-if="product.platforms.lazada.shipping" class="flex items-center justify-end space-x-1 text-xs text-gray-500">
                   <span>🚚</span>
                   <span v-if="product.platforms.lazada.shipping.freeShipping" class="text-green-600 font-medium">
                     Penghantaran Percuma
                   </span>
                   <span v-else-if="product.platforms.lazada.shipping.cost" class="font-medium">
                     RM {{ formatPrice(product.platforms.lazada.shipping.cost) }}
                   </span>
                   <span v-if="product.platforms.lazada.shipping.estimatedDays" class="text-gray-400">
                     | {{ product.platforms.lazada.shipping.estimatedDays }} hari
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Single Platform Available -->
        <div v-if="!product.platforms?.shopee && !product.platforms?.lazada" class="text-center py-4 text-gray-500">
          Maklumat harga tidak tersedia
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2">
        <!-- View Details Button -->
        <button
          @click="viewDetails"
          class="w-full btn-primary text-center py-2"
        >
          Lihat Detail & Sejarah Harga
        </button>

        <!-- Platform Links -->
        <div class="space-y-2">
          <!-- Primary Platform Link (Best Price) -->
          <a
            v-if="bestPlatform && getOptimizedLink(bestPlatform)"
            :href="getOptimizedLink(bestPlatform)"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full btn-primary text-center py-3 flex items-center justify-center space-x-2 relative overflow-hidden group"
            @click="trackClick(bestPlatform, getOptimizedLink(bestPlatform))"
          >
            <div class="flex items-center space-x-2">
              <div :class="[
                'w-5 h-5 rounded text-white text-xs font-bold flex items-center justify-center',
                bestPlatform === 'shopee' ? 'bg-orange-500' : 'bg-blue-500'
              ]">
                {{ bestPlatform === 'shopee' ? 'S' : 'L' }}
              </div>
              <span class="font-medium">
                Beli di {{ bestPlatform === 'shopee' ? 'Shopee' : 'Lazada' }}
              </span>
              <span class="text-sm opacity-90">
                (RM {{ formatPrice(product.platforms[bestPlatform].price) }})
              </span>
            </div>
            <div class="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
              TERBAIK
            </div>
          </a>

          <!-- Secondary Platform Links -->
          <div class="grid grid-cols-2 gap-2">
            <a
              v-if="product.platforms?.shopee?.url && bestPlatform !== 'shopee'"
              :href="getOptimizedLink('shopee')"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline text-center py-2 text-sm bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 flex items-center justify-center space-x-1"
              @click="trackClick('shopee', getOptimizedLink('shopee'))"
            >
              <div class="w-4 h-4 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">
                S
              </div>
              <span>Shopee</span>
              <span class="text-xs opacity-75">
                (RM {{ formatPrice(product.platforms.shopee.price) }})
              </span>
            </a>
            
            <a
              v-if="product.platforms?.lazada?.url && bestPlatform !== 'lazada'"
              :href="getOptimizedLink('lazada')"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline text-center py-2 text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center justify-center space-x-1"
              @click="trackClick('lazada', getOptimizedLink('lazada'))"
            >
              <div class="w-4 h-4 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
                L
              </div>
              <span>Lazada</span>
              <span class="text-xs opacity-75">
                (RM {{ formatPrice(product.platforms.lazada.price) }})
              </span>
            </a>

            <!-- Show both if no best platform determined -->
            <a
              v-if="!bestPlatform && product.platforms?.shopee?.url"
              :href="getOptimizedLink('shopee')"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline text-center py-2 text-sm bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 flex items-center justify-center space-x-1"
              @click="trackClick('shopee', getOptimizedLink('shopee'))"
            >
              <div class="w-4 h-4 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">
                S
              </div>
              <span>Shopee</span>
            </a>
            
            <a
              v-if="!bestPlatform && product.platforms?.lazada?.url"
              :href="getOptimizedLink('lazada')"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline text-center py-2 text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center justify-center space-x-1"
              @click="trackClick('lazada', getOptimizedLink('lazada'))"
            >
              <div class="w-4 h-4 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
                L
              </div>
              <span>Lazada</span>
            </a>
          </div>
        </div>
      </div>

            <!-- Seller Comparison Summary -->
      <div v-if="product.platforms?.shopee?.seller && product.platforms?.lazada?.seller" class="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 class="text-sm font-medium text-gray-700 mb-2 text-center">Perbandingan Penjual</h4>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <!-- Shopee Seller Summary -->
          <div class="text-center">
            <div class="text-orange-600 font-medium mb-1">Shopee</div>
            <div :class="getSellerTrustColor(getSellerTrustLevel(product.platforms.shopee.seller))" class="font-medium">
              {{ getSellerTrustText(getSellerTrustLevel(product.platforms.shopee.seller)) }}
            </div>
            <div class="text-gray-500 mt-1 space-y-0.5">
              <div v-if="product.platforms.shopee.seller.rating">
                Rating: {{ product.platforms.shopee.seller.rating }}/5
              </div>
              <div v-if="product.platforms.shopee.seller.responseRate">
                Respon: {{ product.platforms.shopee.seller.responseRate }}%
              </div>
              <div v-if="product.platforms.shopee.shipping?.freeShipping" class="text-green-600">
                ✓ Penghantaran Percuma
              </div>
              <div v-if="product.platforms.shopee.seller.followerCount" class="truncate">
                {{ formatNumber(product.platforms.shopee.seller.followerCount) }} pengikut
              </div>
            </div>
          </div>
          
          <!-- Lazada Seller Summary -->
          <div class="text-center">
            <div class="text-blue-600 font-medium mb-1">Lazada</div>
            <div :class="getSellerTrustColor(getSellerTrustLevel(product.platforms.lazada.seller))" class="font-medium">
              {{ getSellerTrustText(getSellerTrustLevel(product.platforms.lazada.seller)) }}
            </div>
            <div class="text-gray-500 mt-1 space-y-0.5">
              <div v-if="product.platforms.lazada.seller.rating">
                Rating: {{ product.platforms.lazada.seller.rating }}/5
              </div>
              <div v-if="product.platforms.lazada.seller.responseRate">
                Respon: {{ product.platforms.lazada.seller.responseRate }}%
              </div>
              <div v-if="product.platforms.lazada.shipping?.freeShipping" class="text-green-600">
                ✓ Penghantaran Percuma
              </div>
              <div v-if="product.platforms.lazada.seller.followerCount" class="truncate">
                {{ formatNumber(product.platforms.lazada.seller.followerCount) }} pengikut
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Specification Comparison -->
      <div v-if="hasSpecifications" class="mt-3">
        <button
          @click="toggleSpecifications"
          class="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center justify-between"
        >
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 bg-indigo-600 rounded text-white text-xs font-bold flex items-center justify-center">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm font-medium text-indigo-700">
              Bandingkan Spesifikasi
            </span>
            <span v-if="specificationDifferences > 0" class="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {{ specificationDifferences }} perbezaan
            </span>
          </div>
          <ChevronDownIcon 
            :class="[
              'h-4 w-4 text-indigo-600 transition-transform duration-200',
              showSpecifications ? 'transform rotate-180' : ''
            ]" 
          />
        </button>

        <!-- Expandable Specification Details -->
        <div 
          v-if="showSpecifications" 
          class="mt-2 p-3 bg-white border border-gray-200 rounded-lg space-y-3"
        >
          <!-- Specification Categories -->
          <div v-for="category in specificationCategories" :key="category.name" class="space-y-2">
            <h5 class="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1">
              {{ category.name }}
            </h5>
            
            <div class="space-y-1">
              <div 
                v-for="spec in category.specs" 
                :key="spec.key"
                :class="[
                  'grid grid-cols-3 gap-2 text-xs py-1',
                  spec.isDifferent ? 'bg-yellow-50 border-l-2 border-yellow-400 pl-2' : ''
                ]"
              >
                <!-- Specification Name -->
                <div class="font-medium text-gray-700 flex items-center">
                  {{ spec.displayName }}
                  <span v-if="spec.isDifferent" class="ml-1 text-yellow-600">⚠️</span>
                </div>
                
                <!-- Shopee Value -->
                <div class="text-gray-600 truncate" :title="spec.shopeeValue">
                  <span class="text-orange-600 font-medium text-xs">S:</span>
                  {{ spec.shopeeValue || 'N/A' }}
                </div>
                
                <!-- Lazada Value -->
                <div class="text-gray-600 truncate" :title="spec.lazadaValue">
                  <span class="text-blue-600 font-medium text-xs">L:</span>
                  {{ spec.lazadaValue || 'N/A' }}
                </div>
              </div>
            </div>
          </div>

          <!-- No Specifications Available -->
          <div v-if="specificationCategories.length === 0" class="text-center py-4 text-gray-500">
            <div class="text-4xl mb-2">📋</div>
            <p class="text-sm">Spesifikasi tidak tersedia untuk perbandingan</p>
          </div>
        </div>
      </div>

      <!-- Price Difference Highlight -->
      <div v-if="priceDifference > 0 && bestPlatform" class="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center">
        <div class="flex items-center justify-center space-x-2">
          <span class="text-lg">💰</span>
          <div>
            <div class="text-sm font-semibold text-green-800">
              Jimat RM {{ formatPrice(priceDifference) }}
            </div>
            <div class="text-xs text-green-600">
              dengan memilih {{ bestPlatform === 'shopee' ? 'Shopee' : 'Lazada' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Equal Price Notice -->
      <div v-else-if="priceDifference === 0 && product.platforms?.shopee && product.platforms?.lazada" 
           class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-center">
        <span class="text-sm text-blue-700 font-medium">
          🤝 Harga sama di kedua-dua platform
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { 
  StarIcon, 
  MapPinIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import { preloadImages, isValidImageUrl, getOptimizedImageUrl } from '~/utils/imageUtils'

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['track-click', 'add-to-wishlist'])

// State
const favoriteLoading = ref(false)
const imageError = ref(false)
const imageLoading = ref(true)
const currentImageIndex = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)
const showSpecifications = ref(false)

// Computed
const lowestPrice = computed(() => {
  const prices = []
  if (props.product.platforms?.shopee?.price) {
    prices.push(props.product.platforms.shopee.price)
  }
  if (props.product.platforms?.lazada?.price) {
    prices.push(props.product.platforms.lazada.price)
  }
  return prices.length > 0 ? Math.min(...prices) : 0
})

const isShopeeLowest = computed(() => {
  const shopeePrice = props.product.platforms?.shopee?.price || Infinity
  const lazadaPrice = props.product.platforms?.lazada?.price || Infinity
  return shopeePrice <= lazadaPrice
})

const isFavorite = computed(() => {
  return false // Always false since no auth
})

const priceDifference = computed(() => {
  const shopeePrice = props.product.platforms?.shopee?.price
  const lazadaPrice = props.product.platforms?.lazada?.price
  
  if (!shopeePrice || !lazadaPrice) return 0
  
  return Math.abs(shopeePrice - lazadaPrice)
})

const bestPlatform = computed(() => {
  const shopeePrice = props.product.platforms?.shopee?.price
  const lazadaPrice = props.product.platforms?.lazada?.price
  
  if (!shopeePrice && !lazadaPrice) return null
  if (!shopeePrice) return 'lazada'
  if (!lazadaPrice) return 'shopee'
  
  return shopeePrice <= lazadaPrice ? 'shopee' : 'lazada'
})

const currentImage = computed(() => {
  if (validImages.value.length === 0) return null
  const imageUrl = validImages.value[currentImageIndex.value] || validImages.value[0]
  return getOptimizedImageUrl(imageUrl, { width: 400, height: 300 })
})

const validImages = computed(() => {
  if (!props.product.images) return []
  return props.product.images.filter(url => isValidImageUrl(url))
})

const hasValidLinks = computed(() => {
  const shopeeValid = props.product.platforms?.shopee?.url && isValidUrl(props.product.platforms.shopee.url)
  const lazadaValid = props.product.platforms?.lazada?.url && isValidUrl(props.product.platforms.lazada.url)
  return { shopee: shopeeValid, lazada: lazadaValid }
})

const hasSpecifications = computed(() => {
  const shopeeSpecs = props.product.platforms?.shopee?.specifications
  const lazadaSpecs = props.product.platforms?.lazada?.specifications
  return !!(shopeeSpecs && Object.keys(shopeeSpecs).length > 0) || 
         !!(lazadaSpecs && Object.keys(lazadaSpecs).length > 0)
})

const specificationCategories = computed(() => {
  if (!hasSpecifications.value) return []
  
  const shopeeSpecs = props.product.platforms?.shopee?.specifications || {}
  const lazadaSpecs = props.product.platforms?.lazada?.specifications || {}
  
  // Get all unique specification keys from both platforms
  const allSpecs = new Set([
    ...Object.keys(shopeeSpecs),
    ...Object.keys(lazadaSpecs)
  ])
  
  // Group specifications by category
  const categories = {}
  
  for (const specKey of allSpecs) {
    const category = getSpecificationCategory(specKey, props.product.category)
    const displayName = getSpecificationDisplayName(specKey)
    
    if (!categories[category]) {
      categories[category] = {
        name: category,
        specs: []
      }
    }
    
    const shopeeValue = shopeeSpecs[specKey]
    const lazadaValue = lazadaSpecs[specKey]
    const isDifferent = shopeeValue && lazadaValue && 
                       normalizeSpecValue(shopeeValue) !== normalizeSpecValue(lazadaValue)
    
    categories[category].specs.push({
      key: specKey,
      displayName,
      shopeeValue: formatSpecificationValue(shopeeValue),
      lazadaValue: formatSpecificationValue(lazadaValue),
      isDifferent
    })
  }
  
  // Sort categories by importance and specs within categories
  return Object.values(categories)
    .sort((a, b) => getCategoryOrder(a.name) - getCategoryOrder(b.name))
    .map(category => ({
      ...category,
      specs: category.specs.sort((a, b) => a.displayName.localeCompare(b.displayName))
    }))
})

const specificationDifferences = computed(() => {
  return specificationCategories.value.reduce((count, category) => {
    return count + category.specs.filter(spec => spec.isDifferent).length
  }, 0)
})

// Watch for product changes to reset image state
watch(() => props.product._id, () => {
  currentImageIndex.value = 0
  imageLoading.value = true
  imageError.value = false
  preloadProductImages()
})

// Preload images on mount
onMounted(() => {
  preloadProductImages()
})

// Preload product images for better performance
const preloadProductImages = async () => {
  if (validImages.value.length > 1) {
    // Preload next few images in background
    const imagesToPreload = validImages.value.slice(1, 4) // Preload next 3 images
    try {
      await preloadImages(imagesToPreload)
    } catch (error) {
      console.log('Some images failed to preload:', error)
    }
  }
}

// Methods
const formatPrice = (price) => {
  if (!price) return '0.00'
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const handleImageError = () => {
  imageError.value = true
  imageLoading.value = false
}

const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const nextImage = () => {
  if (currentImageIndex.value < validImages.value.length - 1) {
    currentImageIndex.value++
    imageLoading.value = true
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    imageLoading.value = true
  }
}

const setCurrentImage = (index) => {
  if (index >= 0 && index < validImages.value.length) {
    currentImageIndex.value = index
    imageLoading.value = true
  }
}

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX
  handleSwipeGesture()
}

const handleSwipeGesture = () => {
  const swipeThreshold = 50
  const swipeDistance = touchStartX.value - touchEndX.value
  
  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // Swipe left - next image
      nextImage()
    } else {
      // Swipe right - previous image
      previousImage()
    }
  }
}

const isBestPrice = (platform) => {
  return bestPlatform.value === platform
}

const getDiscountPercentage = (platform) => {
  const platformData = props.product.platforms?.[platform]
  if (!platformData?.originalPrice || !platformData?.price) return 0
  
  const discount = ((platformData.originalPrice - platformData.price) / platformData.originalPrice) * 100
  return Math.round(discount)
}

const getSellerTrustLevel = (seller) => {
  if (!seller) return 'unknown'
  
  let score = 0
  
  // Verified seller
  if (seller.verified) score += 30
  
  // Official store (Lazada)
  if (seller.isOfficial) score += 40
  
  // High seller rating
  if (seller.rating >= 4.8) score += 20
  else if (seller.rating >= 4.5) score += 15
  else if (seller.rating >= 4.0) score += 10
  
  // High follower count or established seller
  if (seller.followerCount >= 10000) score += 10
  
  if (score >= 70) return 'excellent'
  if (score >= 50) return 'good'
  if (score >= 30) return 'average'
  return 'low'
}

const getSellerTrustColor = (trustLevel) => {
  switch (trustLevel) {
    case 'excellent': return 'text-green-600'
    case 'good': return 'text-blue-600'
    case 'average': return 'text-yellow-600'
    case 'low': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getSellerTrustText = (trustLevel) => {
  switch (trustLevel) {
    case 'excellent': return 'Penjual Terpercaya'
    case 'good': return 'Penjual Baik'
    case 'average': return 'Penjual Biasa'
    case 'low': return 'Penjual Baru'
    default: return 'Tiada Data'
  }
}

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

const getSpecificationCategory = (specKey, productCategory) => {
  const key = specKey.toLowerCase()
  
  // Category-specific groupings
  if (productCategory === 'Smartphone' || productCategory === 'Tablet') {
    if (key.includes('display') || key.includes('screen') || key.includes('resolution')) return 'Paparan'
    if (key.includes('processor') || key.includes('cpu') || key.includes('chipset')) return 'Pemprosesan'
    if (key.includes('memory') || key.includes('ram') || key.includes('storage')) return 'Memori & Storan'
    if (key.includes('camera') || key.includes('megapixel') || key.includes('lens')) return 'Kamera'
    if (key.includes('battery') || key.includes('mah') || key.includes('charging')) return 'Bateri'
    if (key.includes('connectivity') || key.includes('wifi') || key.includes('bluetooth')) return 'Sambungan'
  }
  
  if (productCategory === 'Laptop') {
    if (key.includes('display') || key.includes('screen') || key.includes('resolution')) return 'Paparan'
    if (key.includes('processor') || key.includes('cpu') || key.includes('intel') || key.includes('amd')) return 'Pemprosesan'
    if (key.includes('memory') || key.includes('ram')) return 'Memori'
    if (key.includes('storage') || key.includes('ssd') || key.includes('hdd')) return 'Storan'
    if (key.includes('graphics') || key.includes('gpu') || key.includes('nvidia') || key.includes('amd')) return 'Grafik'
    if (key.includes('battery') || key.includes('hours')) return 'Bateri'
    if (key.includes('port') || key.includes('usb') || key.includes('hdmi')) return 'Port & Sambungan'
  }
  
  // General categories
  if (key.includes('dimension') || key.includes('weight') || key.includes('size')) return 'Dimensi & Berat'
  if (key.includes('color') || key.includes('colour') || key.includes('material')) return 'Reka Bentuk'
  if (key.includes('warranty') || key.includes('guarantee')) return 'Waranti'
  
  return 'Lain-lain'
}

const getSpecificationDisplayName = (specKey) => {
  const mappings = {
    // Common specifications
    'display_size': 'Saiz Skrin',
    'screen_size': 'Saiz Skrin',
    'resolution': 'Resolusi',
    'processor': 'Pemproses',
    'cpu': 'CPU',
    'ram': 'RAM',
    'storage': 'Storan',
    'internal_storage': 'Storan Dalaman',
    'battery': 'Bateri',
    'battery_capacity': 'Kapasiti Bateri',
    'camera': 'Kamera',
    'front_camera': 'Kamera Hadapan',
    'rear_camera': 'Kamera Belakang',
    'operating_system': 'Sistem Operasi',
    'os': 'Sistem Operasi',
    'weight': 'Berat',
    'dimensions': 'Dimensi',
    'color': 'Warna',
    'brand': 'Jenama',
    'model': 'Model',
    'warranty': 'Waranti',
    
    // Smartphone specific
    'network': 'Rangkaian',
    'sim': 'SIM',
    'bluetooth': 'Bluetooth',
    'wifi': 'Wi-Fi',
    'gps': 'GPS',
    'fingerprint': 'Cap Jari',
    'face_unlock': 'Buka Kunci Muka',
    
    // Laptop specific
    'graphics': 'Kad Grafik',
    'gpu': 'GPU',
    'ports': 'Port',
    'keyboard': 'Papan Kekunci',
    'touchpad': 'Touchpad',
    'webcam': 'Kamera Web',
    'speakers': 'Pembesar Suara',
    
    // Audio specific
    'frequency_response': 'Respons Frekuensi',
    'impedance': 'Impedans',
    'driver_size': 'Saiz Driver',
    'connectivity': 'Sambungan',
    'noise_cancellation': 'Pembatalan Bunyi',
    'playtime': 'Masa Main',
    'charging_time': 'Masa Pengecasan'
  }
  
  const normalized = specKey.toLowerCase().replace(/[^a-z0-9]/g, '_')
  return mappings[normalized] || specKey.split(/[_\s-]/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

const formatSpecificationValue = (value) => {
  if (!value) return 'N/A'
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak'
  if (Array.isArray(value)) return value.join(', ')
  return JSON.stringify(value)
}

const normalizeSpecValue = (value) => {
  if (!value) return ''
  return value.toString().toLowerCase().replace(/[^a-z0-9]/g, '')
}

const getCategoryOrder = (categoryName) => {
  const order = {
    'Paparan': 1,
    'Pemprosesan': 2,
    'Memori': 3,
    'Memori & Storan': 3,
    'Storan': 4,
    'Grafik': 5,
    'Kamera': 6,
    'Bateri': 7,
    'Sambungan': 8,
    'Port & Sambungan': 8,
    'Dimensi & Berat': 9,
    'Reka Bentuk': 10,
    'Waranti': 11,
    'Lain-lain': 99
  }
  return order[categoryName] || 50
}

const toggleSpecifications = () => {
  showSpecifications.value = !showSpecifications.value
}

const viewDetails = () => {
  emit('track-click', {
    productId: props.product._id,
    platform: bestPlatform.value,
    url: getOptimizedLink(bestPlatform.value)
  })
  navigateTo(`/product/${props.product._id}`)
}

const getOptimizedLink = (platform) => {
  const platformData = props.product.platforms?.[platform]
  if (!platformData?.url) return null
  
  try {
    const url = new URL(platformData.url)
    
    // Add UTM parameters for tracking
    const utmParams = {
      utm_source: 'compare-harga',
      utm_medium: 'product-card',
      utm_campaign: 'price-comparison',
      utm_content: `${platform}-${props.product._id}`,
      utm_term: props.product.name.toLowerCase().replace(/\s+/g, '-')
    }
    
    // Add tracking parameters
    Object.entries(utmParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    
    // Add affiliate ID if available
    if (platformData.affiliateId) {
      if (platform === 'shopee') {
        url.searchParams.set('affiliate_id', platformData.affiliateId)
      } else if (platform === 'lazada') {
        url.searchParams.set('aff_sub', platformData.affiliateId)
      }
    }
    
    // Add timestamp for cache busting
    url.searchParams.set('t', Date.now().toString())
    
    return url.toString()
  } catch (error) {
    console.warn(`Invalid URL for ${platform}:`, platformData.url)
    return platformData.url // Fallback to original URL
  }
}

const trackClick = (platform, url) => {
  emit('track-click', {
    productId: props.product._id,
    platform,
    url
  })
  window.open(url, '_blank')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation for best price highlighting */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.3);
  }
}

.ring-2.ring-green-200 {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Subtle gradient animation for savings highlight */
@keyframes gradient-shimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shimmer 3s ease-in-out infinite;
}
</style> 