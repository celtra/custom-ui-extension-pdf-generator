<template>
  <div class="extension-main-container">
    <error-panel
      v-if="exportFailedMessage !== null"
      title="Export failed"
      :message="exportFailedMessage"
    />
    <loading-panel v-else-if="showLoadingPanel" />
    <info-panel v-else />
  </div>
</template>

<script setup lang="ts">
import LoadingPanel from './views/LoadingPanel.vue'
import ErrorPanel from './views/ErrorPanel.vue'
import InfoPanel from './views/InfoPanel.vue'
import { computed } from 'vue'
import { useExportApiStore } from './stores/export-api'

const exportApiStore = useExportApiStore()
exportApiStore.export('custom-extension-template')

const showLoadingPanel = computed(() => exportApiStore.inProgress)
const exportFailedMessage = computed(() => exportApiStore.exportFailedMessage)
</script>

<style scoped>
.extension-main-container {
  padding: 16px;
  height: 100vh;
}
</style>
