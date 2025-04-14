<template>
  <v-app>
    <PDFGenerator />
  </v-app>
</template>

<script setup lang="ts">
import LoadingPanel from './distribution/LoadingPanel.vue'
import ErrorPanel from './distribution/ErrorPanel.vue'
import InfoPanel from './distribution/InfoPanel.vue'
import { computed } from 'vue'
import { useExportApiStore } from './stores/export-api'

const exportApiStore = useExportApiStore()
  exportApiStore.export('custom-extension-template', 'generic')

const showLoadingPanel = computed(() => exportApiStore.inProgress)
const exportFailedMessage = computed(() => exportApiStore.exportFailedMessage)
</script>

<style scoped>
.extension-main-container {
  padding: 16px;
  height: 100vh;
}
</style>
