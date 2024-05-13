import { defineStore } from 'pinia'
import type { State } from './types'
import { requestPayload } from './utils'
import celtra, {
  type Output,
  type AdServer,
  type FinishedAsyncAsset,
  type ImageAsset,
  type VideoAsset,
  type HTMLAsset,
} from '@celtra-public/eagle-extensions-sdk'

export const useExportApiStore = defineStore('export-api', {
  state: (): State => ({
    inProgress: false,
    designFileContentBlobHash: null,
    pendingOutputsCount: 0,
    outputs: [],
    exportFailedMessage: null
  }),
  actions: {
    async export (caller: string, adServer: AdServer | null = null): Promise<void> {
      this.inProgress = true
      if (celtra.launchOptions.distribution === undefined) {
        const errorMessage = 'Creatives cannot be exported.'
        throw new Error(errorMessage)
      }
      const { designFileId, selectedOutputIds } = celtra.launchOptions.distribution
      await this.waitForFinishedExport(designFileId, selectedOutputIds, adServer, caller, 2000)
      this.inProgress = false
    },
    async waitForFinishedExport (designFileId: string, outputIds: string[], adServer: AdServer | null, caller: string, timeoutInterval = 2000): Promise<void> {
      try {
        const payload = requestPayload(designFileId, outputIds, this.designFileContentBlobHash, adServer, caller)
        const outputs = await celtra.export(payload)

        outputs.forEach((output: Output) => {
          if (output.status === 'error') {
            throw new Error(`Failed to export creative: ${output.id}`)
          }
        })

        // Design file might be updated during export, we need to lock to the first content blob hash to guarantee that the export completes for the same version.
        this.designFileContentBlobHash = outputs[0].designFile.contentBlobHash

        this.pendingOutputsCount = outputs.filter((output: Output) => output.status === 'pending').length

        if (this.pendingOutputsCount > 0) {
          return await new Promise((resolve) => setTimeout(() => { resolve(this.waitForFinishedExport(designFileId, outputIds, adServer, caller, timeoutInterval)) }, timeoutInterval))
        } else {
          this.inProgress = false
          this.outputs = outputs
        }
      } catch (error: any) {
        this.inProgress = false
        const message = error.message
        if (typeof message === 'string') {
          this.exportFailedMessage = message
        } else {
          this.exportFailedMessage = 'Something went wrong when exporting creatives.'
        }
      }
    },
  },
  getters: {
    allOutputsCount (): number {
      return this.outputs.length
    },
    progressMessage (): string {
      if (this.allOutputsCount === 0) {
        return 'Exporting creatives...'
      }
      return `Exporting creatives... [${this.allOutputsCount - this.pendingOutputsCount}/${this.allOutputsCount}]`
    },
    outputsInfo (): {
        id: string
        name: string
        assets: {
          type: 'Image' | 'Video' | 'HTML'
          url: string
        }[]
      }[] {
      return this.outputs.map((output: Output) => ({
        id: output.id,
        name: output.mediaLineItem.name,
        assets: Object.values(output.assets)
          .filter((asset): asset is (ImageAsset | VideoAsset | HTMLAsset) & FinishedAsyncAsset =>
            asset !== undefined &&
            (asset.type == 'Image' || asset.type == 'Video' || asset.type == 'HTML') &&
            asset.status === 'finished')
          .map((asset) => ({
            type: asset.type,
            url: asset.url
          }))
      }))
    },
  }
})
