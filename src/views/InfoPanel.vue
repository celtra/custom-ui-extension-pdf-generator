<template>
  <v-table class="asset-preview-table">
    <thead>
      <tr>
        <th>
          <div class="asset-preview-table-header">
            Name
          </div>
        </th>
        <th
          v-for="name in customAttributeNames"
          :key="name"
        >
          <div class="asset-preview-table-header">
            {{ name }}
          </div>
        </th>
        <th>
          <div class="asset-preview-table-header">
            Preview
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="output in outputsInfo"
        :key="output.id"
      >
        <td class="asset-preview-name">
          <div class="asset-preview-cell">
            {{ output.name }}
          </div>
        </td>
        <td
          v-for="name in customAttributeNames"
          :key="name"
        >
          <div class="asset-preview-cell">
            <v-select
              :label="name"
              density="compact"
              :model-value="attributeSelectionVModel(output.id, name)"
              :items="outputAttributesPossibleValues(name)"
              variant="outlined"
              clearable
              @update:model-value="(newValue: string | null) => onAttributeSelectionUpdate(output.id, name, newValue)"
            />
          </div>
        </td>
        <td class="asset-preview-preview">
          <div class="asset-preview-cell">
            <v-carousel
              class="asset-preview"
              height="100%"
              hide-delimiters
              :progress="output.assets.length > 1 ? true : false"
              :show-arrows="output.assets.length > 1 ? 'hover' : false"
            >
              <v-carousel-item
                v-for="(asset, i) in output.assets"
                :key="i"
              >
                <img
                  v-if="asset.type === 'Image'"
                  :src="asset.url"
                  :alt="output.name"
                  class="asset-preview-media"
                >
                <video
                  v-else-if="asset.type === 'Video'"
                  :src="asset.url"
                  :alt="output.name"
                  class="asset-preview-media"
                  controls
                />
                <div
                  v-else-if="asset.type === 'HTML'"
                  class="asset-preview-media"
                >
                  HTML preview not available.
                </div>
              </v-carousel-item>
            </v-carousel>
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { useExportApiStore } from '../stores/export-api'
import { useAttributesStore } from '../stores/attributes'
import { computed } from 'vue'
import { OUTPUT_ATTRIBUTES_REGISTRATION_OPTIONS } from '../constants';
const exportApiStore = useExportApiStore()
const attributesStore = useAttributesStore()

const outputsInfo = computed(() => exportApiStore.outputsInfo)

const customAttributeNames = Object.keys(OUTPUT_ATTRIBUTES_REGISTRATION_OPTIONS)

const attributeSelectionVModel = (outputId: string, name:string): string | undefined => {
  return attributesStore.outputAttributes.find((singleOutputAttributes) => singleOutputAttributes.outputId === outputId)?.attributes[name]
}

const onAttributeSelectionUpdate = (outputId: string, name: string, newValue: string | null) => {
  attributesStore.setAttribute(outputId, name, newValue)
}

function outputAttributesPossibleValues (name: string): string[] {
  const outputAttributesRegistrationOption = attributesStore.outputAttributesRegistrationOptions[name]
  return outputAttributesRegistrationOption !== undefined && outputAttributesRegistrationOption.filterable === true ? outputAttributesRegistrationOption.filterValues : []
}
</script>

<style scoped>
.info {
  margin-bottom: 16px;
}

.asset-preview-table-header {
  font-weight: 700;
  font-size: 14px;
  padding: 1;
}

.asset-preview-table {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.asset-preview-media {
  height: 100%;
  width: 100%;
  object-fit: contain;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
}

.asset-preview-name {
  width: 400px;
}

.asset-preview-preview {
  width: 352px;
}

.asset-preview-cell {
  height: 320px;
  padding: 16px 0px;
}
</style>
