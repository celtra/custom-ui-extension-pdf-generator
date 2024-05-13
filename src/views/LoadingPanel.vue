<template>
  <div class="export-panel-wrapper">
    <span>
      <v-progress-circular indeterminate />
      {{ progressMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useExportApiStore } from '../stores/export-api'
import { computed } from 'vue'

const exportApiStore = useExportApiStore()
const progressMessage = computed(() => exportApiStore.progressMessage)

</script>

<style>
.export-panel-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
