import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import celtra, { OutputAttributes, OutputAttributesRegistrationOptions } from '@celtra-public/eagle-extensions-sdk'
import { EXAMPLE_DISTRIBUTION_WORKFLOW, OUTPUT_ATTRIBUTES_REGISTRATION_OPTIONS } from './constants'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import { useAttributesStore } from './stores/attributes'

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

// When launchOptions distribution is true, the extension appears as a window opened in export dialog.
if (celtra.launchOptions.distribution) {
  const vuetify = createVuetify({
    components,
    directives
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
