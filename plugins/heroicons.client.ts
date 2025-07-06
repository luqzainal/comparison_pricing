import { defineNuxtPlugin } from '#app'
import { 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  Bars3Icon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

export default defineNuxtPlugin((nuxtApp) => {
  // Register HeroIcons globally
  nuxtApp.vueApp.component('MagnifyingGlassIcon', MagnifyingGlassIcon)
  nuxtApp.vueApp.component('ShoppingCartIcon', ShoppingCartIcon)
  nuxtApp.vueApp.component('HeartIcon', HeartIcon)
  nuxtApp.vueApp.component('StarIcon', StarIcon)
  nuxtApp.vueApp.component('ChevronDownIcon', ChevronDownIcon)
  nuxtApp.vueApp.component('ChevronUpIcon', ChevronUpIcon)
  nuxtApp.vueApp.component('XMarkIcon', XMarkIcon)
  nuxtApp.vueApp.component('Bars3Icon', Bars3Icon)
  nuxtApp.vueApp.component('UserIcon', UserIcon)
  nuxtApp.vueApp.component('Cog6ToothIcon', Cog6ToothIcon)
  nuxtApp.vueApp.component('ArrowRightIcon', ArrowRightIcon)
  nuxtApp.vueApp.component('ArrowLeftIcon', ArrowLeftIcon)
  nuxtApp.vueApp.component('PlusIcon', PlusIcon)
  nuxtApp.vueApp.component('MinusIcon', MinusIcon)
  nuxtApp.vueApp.component('CheckIcon', CheckIcon)
  nuxtApp.vueApp.component('ExclamationTriangleIcon', ExclamationTriangleIcon)
  nuxtApp.vueApp.component('InformationCircleIcon', InformationCircleIcon)
}) 