import type { Output } from '@celtra-public/eagle-extensions-sdk'

export interface State {
  inProgress: boolean
  pendingOutputsCount: number
  designFileContentBlobHash: string | null
  outputs: Output[]
  exportFailedMessage: string | null
}
