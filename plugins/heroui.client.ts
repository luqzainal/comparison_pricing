import { defineNuxtPlugin } from '#app'
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Switch,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption
} from '@headlessui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Register Headless UI components globally
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('DialogPanel', DialogPanel)
  nuxtApp.vueApp.component('DialogTitle', DialogTitle)
  nuxtApp.vueApp.component('TransitionChild', TransitionChild)
  nuxtApp.vueApp.component('TransitionRoot', TransitionRoot)
  nuxtApp.vueApp.component('Listbox', Listbox)
  nuxtApp.vueApp.component('ListboxButton', ListboxButton)
  nuxtApp.vueApp.component('ListboxOptions', ListboxOptions)
  nuxtApp.vueApp.component('ListboxOption', ListboxOption)
  nuxtApp.vueApp.component('Combobox', Combobox)
  nuxtApp.vueApp.component('ComboboxInput', ComboboxInput)
  nuxtApp.vueApp.component('ComboboxButton', ComboboxButton)
  nuxtApp.vueApp.component('ComboboxOptions', ComboboxOptions)
  nuxtApp.vueApp.component('ComboboxOption', ComboboxOption)
  nuxtApp.vueApp.component('Menu', Menu)
  nuxtApp.vueApp.component('MenuButton', MenuButton)
  nuxtApp.vueApp.component('MenuItems', MenuItems)
  nuxtApp.vueApp.component('MenuItem', MenuItem)
  nuxtApp.vueApp.component('Popover', Popover)
  nuxtApp.vueApp.component('PopoverButton', PopoverButton)
  nuxtApp.vueApp.component('PopoverPanel', PopoverPanel)
  nuxtApp.vueApp.component('Tab', Tab)
  nuxtApp.vueApp.component('TabGroup', TabGroup)
  nuxtApp.vueApp.component('TabList', TabList)
  nuxtApp.vueApp.component('TabPanels', TabPanels)
  nuxtApp.vueApp.component('TabPanel', TabPanel)
  nuxtApp.vueApp.component('Disclosure', Disclosure)
  nuxtApp.vueApp.component('DisclosureButton', DisclosureButton)
  nuxtApp.vueApp.component('DisclosurePanel', DisclosurePanel)
  nuxtApp.vueApp.component('Switch', Switch)
  nuxtApp.vueApp.component('RadioGroup', RadioGroup)
  nuxtApp.vueApp.component('RadioGroupLabel', RadioGroupLabel)
  nuxtApp.vueApp.component('RadioGroupOption', RadioGroupOption)
}) 