<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Test HeroUI & Auth Components</h2>

    <!-- Auth Section -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Authentication</h3>
      <div v-if="status === 'authenticated'">
        <p class="text-gray-700">Selamat datang, {{ data?.user?.name }}!</p>
        <p class="text-sm text-gray-500">{{ data?.user?.email }}</p>
        <button @click="handleSignOut" class="btn-secondary mt-2">
          Log Keluar
        </button>
      </div>
      <div v-else>
        <p class="text-gray-700">Anda tidak log masuk.</p>
        <button @click="handleSignIn" class="btn-primary mt-2">
          Log Masuk dengan Google
        </button>
      </div>
    </div>
    
    <!-- Test Menu -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Menu Component</h3>
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton class="btn-primary">
            Options
            <ChevronDownIcon class="ml-2 h-4 w-4" />
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
          <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                  Account settings
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                  Support
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <!-- Test Switch -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Switch Component</h3>
      <Switch v-model="enabled" :class="[enabled ? 'bg-blue-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 items-center rounded-full']">
        <span class="sr-only">Enable notifications</span>
        <span :class="[enabled ? 'translate-x-6' : 'translate-x-1', 'inline-block h-4 w-4 transform rounded-full bg-white transition']" />
      </Switch>
      <p class="text-sm text-gray-600">Notifications: {{ enabled ? 'On' : 'Off' }}</p>
    </div>

    <!-- Test Icons -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">HeroIcons</h3>
      <div class="flex space-x-4">
        <MagnifyingGlassIcon class="h-6 w-6 text-blue-600" />
        <ShoppingCartIcon class="h-6 w-6 text-green-600" />
        <HeartIcon class="h-6 w-6 text-red-600" />
        <StarIcon class="h-6 w-6 text-yellow-600" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { status, data, signIn, signOut } = useAuth()

const enabled = ref(false)

const handleSignIn = () => {
  signIn('google')
}

const handleSignOut = () => {
  signOut()
}
</script> 