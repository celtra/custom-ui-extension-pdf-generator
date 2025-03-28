<!-- PDFGenerator.vue -->
<template>
  <v-container class="pa-4" fluid>
    <!-- Title -->
    <v-row>
      <v-col>
        <h1 class="text-h5 font-weight-bold">PDF Generator</h1>
      </v-col>
    </v-row>

    <!-- PDF Settings & Inputs -->
    <!-- ... (UI config code omitted here for brevity) -->

    <!-- Action Buttons -->
    <v-row>
      <v-col>
        <v-btn color="primary" :loading="isGenerating" :disabled="isGenerating" @click="generatePDF">Generate PDF</v-btn>
        <v-btn text @click="resetSettings">Reset Settings</v-btn>
      </v-col>
    </v-row>

    <!-- Batch Progress -->
    <v-alert v-if="store.hasNextBatch && batchCompleted" type="success" class="mt-4">
      ✔️ Batch {{ store.currentBatchIndex + 1 }} complete. Process next {{ store.remainingCount }} outputs?
      <v-btn color="primary" text :loading="isGenerating" :disabled="isGenerating" @click="handleContinue">Continue ⏩</v-btn>
    </v-alert>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { usePdfGeneratorStore } from '../stores/usePdfGeneratorStore';
import { createPDF } from '../utils/pdfUtils';

const store = usePdfGeneratorStore();
const isGenerating = ref(false);
const batchCompleted = ref(false);
const errorMessage = ref('');

const generatePDF = async () => {
  store.saveConfig();
  isGenerating.value = true;
  errorMessage.value = '';

  try {
    const batch = store.currentBatch;
    const images = batch
      .map(output => {
        const asset = output.assets?.image;
        return asset?.status === 'finished' ? { url: asset.url, width: asset.width, height: asset.height } : null;
      })
      .filter(Boolean);

    if (!images.length) throw new Error('No valid images in current batch');

    if (store.config.layout === 'single' && store.config.singleImageMode === 'multiplePdfs') {
      for (let i = 0; i < images.length; i++) {
        const { filename, blob } = await createPDF({
          images: [images[i]],
          config: store.config,
          designFileName: `${store.designFileName}_img${store.currentBatchIndex * store.batchLimit + i + 1}`,
          batchIndex: 0
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } else {
      const { filename, blob } = await createPDF({
        images,
        config: store.config,
        designFileName: store.designFileName,
        batchIndex: store.currentBatchIndex
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    batchCompleted.value = true;
  } catch (err: any) {
    errorMessage.value = err.message;
    console.error('PDF generation error:', err);
  } finally {
    isGenerating.value = false;
  }
};

const handleContinue = async () => {
  batchCompleted.value = false;
  store.nextBatch();
  await generatePDF();
};

const resetSettings = () => {
  store.resetConfigToDefault();
};

onMounted(() => {
  store.loadStoredConfig();
  store.loadFromLaunchOptions();
});
</script>