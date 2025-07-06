<script setup>
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'

const { status, data, signIn, signOut } = useAuth()

const showMobileMenu = ref(false)
const showMobileSearch = ref(false)

async function handleSignOut() {
  await signOut({ callbackUrl: '/' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingCartIcon class="h-5 w-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900">CompareHarga</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              active-class="text-blue-600 font-medium"
            >
              Laman Utama
            </NuxtLink>
            <NuxtLink 
              to="/search" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              active-class="text-blue-600 font-medium"
            >
              Cari Produk
            </NuxtLink>
            <NuxtLink 
              to="/favorites" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              active-class="text-blue-600 font-medium"
            >
              Kegemaran
            </NuxtLink>
            <NuxtLink 
              to="/price-alerts" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              active-class="text-blue-600 font-medium"
            >
              Alert Harga
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Search Button (Mobile) -->
            <button 
              @click="showMobileSearch = true"
              class="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <MagnifyingGlassIcon class="h-5 w-5" />
            </button>

            <!-- Loading Skeleton -->
            <div v-if="status === 'loading'" class="flex items-center space-x-2 animate-pulse">
                <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div class="hidden md:block w-20 h-4 bg-gray-200 rounded"></div>
            </div>

            <!-- Login Button -->
            <button v-if="status === 'unauthenticated'" @click="() => signIn('google')" class="btn-primary">
              Log Masuk
            </button>

            <!-- User Menu Dropdown -->
            <Menu v-if="status === 'authenticated'" as="div" class="relative">
              <div>
                <MenuButton class="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <img :src="data?.user?.image || ''" alt="Avatar" class="w-8 h-8 rounded-full bg-gray-200">
                  <span class="hidden md:block">{{ data?.user?.name }}</span>
                  <ChevronDownIcon class="h-4 w-4" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <NuxtLink 
                        to="/profile" 
                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                      >
                        Profil Saya
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <NuxtLink 
                        to="/settings" 
                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                      >
                        Tetapan
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleSignOut"
                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm']"
                      >
                        Log Keluar
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>

            <!-- Mobile Menu Button -->
            <button 
              @click="showMobileMenu = true"
              class="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Modal -->
    <Dialog :open="showMobileSearch" @close="showMobileSearch = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="w-full max-w-md bg-white rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <DialogTitle class="text-lg font-medium">Cari Produk</DialogTitle>
            <button @click="showMobileSearch = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          <SearchBar @search="showMobileSearch = false" />
        </DialogPanel>
      </div>
    </Dialog>

    <!-- Mobile Menu Modal -->
    <Dialog :open="showMobileMenu" @close="showMobileMenu = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="w-full max-w-sm bg-white rounded-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <DialogTitle class="text-lg font-medium">Menu</DialogTitle>
            <button @click="showMobileMenu = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          <nav class="space-y-4">
            <NuxtLink 
              to="/" 
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 py-2"
              active-class="text-blue-600 font-medium"
            >
              Laman Utama
            </NuxtLink>
            <NuxtLink 
              to="/search" 
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 py-2"
              active-class="text-blue-600 font-medium"
            >
              Cari Produk
            </NuxtLink>
            <NuxtLink 
              to="/favorites" 
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 py-2"
              active-class="text-blue-600 font-medium"
            >
              Kegemaran
            </NuxtLink>
            <NuxtLink 
              to="/price-alerts" 
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 py-2"
              active-class="text-blue-600 font-medium"
            >
              Alert Harga
            </NuxtLink>
          </nav>
        </DialogPanel>
      </div>
    </Dialog>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
      <div class="container mx-auto px-4 py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon class="h-5 w-5 text-white" />
              </div>
              <span class="text-xl font-bold">CompareHarga</span>
            </div>
            <p class="text-gray-400 mb-4">
              Platform perbandingan harga terbaik untuk membantu anda menjimatkan wang 
              dengan membandingkan harga produk di Shopee dan Lazada.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">Twitter</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Pautan Pantas</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/" class="text-gray-400 hover:text-white">Laman Utama</NuxtLink></li>
              <li><NuxtLink to="/search" class="text-gray-400 hover:text-white">Cari Produk</NuxtLink></li>
              <li><NuxtLink to="/favorites" class="text-gray-400 hover:text-white">Kegemaran</NuxtLink></li>
              <li><NuxtLink to="/price-alerts" class="text-gray-400 hover:text-white">Alert Harga</NuxtLink></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Sokongan</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">Bantuan</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Hubungi Kami</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Terma & Syarat</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Dasar Privasi</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400">
            © 2024 CompareHarga. Hak cipta terpelihara.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>