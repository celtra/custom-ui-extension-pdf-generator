import type { Request as ExportApiRequest, AdServer } from '@celtra-public/eagle-extensions-sdk'

/**
 * Constructs payload that can be used to call the export api
 * @param designFileId
 * @param outputIds
 * @returns json payload for export api request
 */
export function requestPayload (designFileId: string, outputIds: string[], designFileContentBlobHash: string | null, adServer: AdServer | null, caller: string): ExportApiRequest {
  const designFileFilter = designFileContentBlobHash !== null ? { version: [{ id: designFileId, contentBlobHash: designFileContentBlobHash }] } : { id: [designFileId] }
  const requestPayload: ExportApiRequest = {
    filters: {
      designFile: designFileFilter,
      ...outputIds.length > 0 && {
        output: {
          id: outputIds
        }
      }
    },
    caller
  }

  if (adServer !== null) {
    requestPayload.assetFormats = {
      HTML: {
        html: {
          adServer
        }
      }
    }
  }

  return requestPayload
}
