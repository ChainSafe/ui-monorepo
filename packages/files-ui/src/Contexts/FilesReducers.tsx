import { TransferOperation, TransferProgress } from "./FilesContext"

export function transfersInProgressReducer(
  transfersInProgress: TransferProgress[],
  action:
    | { type: "add"; payload: TransferProgress }
    | { type: "progress"; payload: { id: string; progress: number } }
    | { type: "operation"; payload: { id: string; operation: TransferOperation}}
    | { type: "complete"; payload: { id: string } }
    | { type: "error"; payload: { id: string; errorMessage?: string } }
    | { type: "remove"; payload: { id: string } }
): TransferProgress[] {
  const getProgressIndex = () =>
    transfersInProgress.findIndex(
      (transfer) => transfer.id === action.payload.id
    )
  switch (action.type) {
  case "add": {
    return [...transfersInProgress, action.payload]
  }
  case "progress": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      transfersInProgress[progressIndex].progress = action.payload.progress
      return [...transfersInProgress]
    } else {
      return transfersInProgress
    }
  }
  case "operation": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      transfersInProgress[progressIndex].operation = action.payload.operation
      return [...transfersInProgress]
    } else {
      return transfersInProgress
    }
  }
  case "complete": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      transfersInProgress[progressIndex].complete = true
      return [...transfersInProgress]
    } else {
      return transfersInProgress
    }
  }
  case "error": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      transfersInProgress[progressIndex].error = true
      transfersInProgress[progressIndex].errorMessage = action.payload.errorMessage
      return [...transfersInProgress]
    } else {
      return transfersInProgress
    }
  }
  case "remove": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      transfersInProgress.splice(progressIndex, 1)
      return [...transfersInProgress]
    } else {
      return transfersInProgress
    }
  }
  default:
    return transfersInProgress
  }
}
