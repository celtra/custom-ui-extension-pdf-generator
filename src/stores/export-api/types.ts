import type { Output } from '@celtra/eagle-extensions-sdk'

export interface State {
  inProgress: boolean
  pendingOutputsCount: number
  designFileContentBlobHash: string | null
  outputs: Output[]
  exportFailedMessage: string | null
}
