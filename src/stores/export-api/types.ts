import type { Output } from '@celtra/eagle-extensions-sdk'

export interface State {
  inProgress: boolean
  designFileContentBlobHash: string | null
  outputs: Output[]
  exportFailedMessage: string | null
}
