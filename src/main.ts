import { createApp, h } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { IconProps, createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import celtra, { OutputAttributes, OutputAttributesRegistrationOptions } from '@celtra/eagle-extensions-sdk'
import { EXAMPLE_DISTRIBUTION_WORKFLOW, OUTPUT_ATTRIBUTES_REGISTRATION_OPTIONS } from './constants'
import { createPinia } from 'pinia'
import { useAttributesStore } from './stores/attributes'
import CarouselNextIcon from './icons/CarouselNextIcon.vue'
import CarouselPrevIcon from './icons/CarouselPrevIcon.vue'
import CarretDown from './icons/CarretDown.vue'
import CloseCircle from './icons/CloseCircle.vue'

// Headless extension that does it's work when design file is opened, like:
// - registering formats
// - registering distribution workflows (registration needed to be used in export)
if (celtra.launchOptions.main) {
  await celtra.registerDistributionWorkflow('example.distribution.workflow', EXAMPLE_DISTRIBUTION_WORKFLOW)

  // First time setting the attributes from persistent storage.
  await headlessAttributesUpdate()
  // Setup listener on extension-storage-changed events for updating output attributes.
  celtra.on('extension-storage-changed', async () => {
    await headlessAttributesUpdate()
  })
}


// Material design icons for veutify add ~6MB to exported html, we use custom icons instead
// To use material design icons, npm install @mdi/font package and import '@mdi/font/css/materialdesignicons.css' here
const icons = {
  carouselNext: CarouselNextIcon,
  carouselPrev: CarouselPrevIcon,
  carretDown: CarretDown,
  closeCircle: CloseCircle,
} as Record<string, any>

// When launchOptions distribution is true, the extension appears as a window opened in export dialog.
if (celtra.launchOptions.distribution) {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      aliases: {
        dropdown: 'custom:carretDown',
        clear: 'custom:closeCircle',
        prev: 'custom:carouselPrev',
        next: 'custom:carouselNext',
      },
      defaultSet: 'custom',
      sets: {
        custom: {
          component: (props: IconProps) => h(icons[props.icon as string]),
        }
      }
    },
  })

  const app = createApp(App)
    .use(createPinia())
    .use(vuetify)

  const attributesStore = useAttributesStore()
  // Initialize the extension attributes store.
  await attributesStore.getExtensionStorage()
  // Register the extension attributes on the first time the extension is opened.
  await attributesStore.addRegisteredAttributes(OUTPUT_ATTRIBUTES_REGISTRATION_OPTIONS)

  app.mount('#app')
}

async function headlessAttributesUpdate () {
  try {
      const { outputAttributesRegistrationOptions, outputAttributes } = await celtra.getExtensionStorage<{ outputAttributesRegistrationOptions: OutputAttributesRegistrationOptions, outputAttributes: OutputAttributes[] }>()
      await celtra.registerOutputAttributes(outputAttributesRegistrationOptions)
      await celtra.setOutputAttributes(outputAttributes)
  } catch (_) {
      // Ignore errors for extension storage not found.
  }
}
