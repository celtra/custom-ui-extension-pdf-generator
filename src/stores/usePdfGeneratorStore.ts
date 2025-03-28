// usePdfGeneratorStore.ts
import { defineStore } from 'pinia';
import { getExtensionStorage, setExtensionStorage, launchOptions } from '@celtra/eagle-extensions-sdk';

export const usePdfGeneratorStore = defineStore('pdfGenerator', {
  state: () => ({
    config: {
      margin: 0.5,
      paperSize: 'US Letter',
      orientation: 'portrait',
      layout: 'single',
      singleImageMode: 'singlePdf',
      imageFormat: 'png',
      jpegQuality: 80,
      jpegMaxSizeKb: null,
      pngColors: 256
    },
    allOutputs: [],
    designFileName: '',
    batchLimit: 75,
    currentBatchIndex: 0
  }),

  getters: {
    totalOutputs: (state) => state.allOutputs.length,
    batches: (state) => {
      const out = [];
      for (let i = 0; i < state.allOutputs.length; i += state.batchLimit) {
        out.push(state.allOutputs.slice(i, i + state.batchLimit));
      }
      return out;
    },
    currentBatch(state): any[] {
      return state.batches[state.currentBatchIndex] || [];
    },
    hasNextBatch(state): boolean {
      return state.currentBatchIndex < state.batches.length - 1;
    },
    remainingCount(state): number {
      return state.totalOutputs - (state.currentBatchIndex + 1) * state.batchLimit;
    }
  },

  actions: {
    async loadStoredConfig() {
      try {
        const stored = await getExtensionStorage<typeof this.config>();
        if (stored) this.config = { ...this.config, ...stored };
      } catch {}
    },

    async saveConfig() {
      await setExtensionStorage(this.config);
    },

    loadFromLaunchOptions() {
      this.allOutputs = launchOptions.distribution?.outputs || [];
      const designFile = launchOptions.distribution?.designFile?.name || 'document';
      this.designFileName = designFile.replace(/[^a-z0-9_\-]/gi, '_');
    },

    setOutputs(outputs: any[]) {
      this.allOutputs = outputs;
      this.currentBatchIndex = 0;
    },

    nextBatch() {
      if (this.hasNextBatch) this.currentBatchIndex++;
    },

    resetConfigToDefault() {
      this.config = this.$reset().config;
    }
  }
});