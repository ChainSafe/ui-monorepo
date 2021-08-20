import { DownloadProgress, TransferOperation, TransferProgress, UploadProgress } from "./FilesContext"

export function uploadsInProgressReducer(
  uploadsInProgress: UploadProgress[],
  action:
    | { type: "add"; payload: UploadProgress }
    | { type: "progress"; payload: { id: string; progress: number } }
    | { type: "complete"; payload: { id: string } }
    | { type: "error"; payload: { id: string; errorMessage?: string } }
    | { type: "remove"; payload: { id: string } }
): UploadProgress[] {
  const getProgressIndex = () =>
    uploadsInProgress.findIndex((progress) => progress.id === action.payload.id)
  switch (action.type) {
  case "add": {
    return [...uploadsInProgress, action.payload]
  }
  case "progress": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      uploadsInProgress[progressIndex].progress = action.payload.progress
      return [...uploadsInProgress]
    } else {
      return uploadsInProgress
    }
  }
  case "complete": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      uploadsInProgress[progressIndex].complete = true
      return [...uploadsInProgress]
    } else {
      return uploadsInProgress
    }
  }
  case "error": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      uploadsInProgress[progressIndex].error = true
      uploadsInProgress[progressIndex].errorMessage =
          action.payload.errorMessage
      return [...uploadsInProgress]
    } else {
      return uploadsInProgress
    }
  }
  case "remove": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      uploadsInProgress.splice(progressIndex, 1)
      return [...uploadsInProgress]
    } else {
      return uploadsInProgress
    }
  }
  default:
    return uploadsInProgress
  }
}

export function downloadsInProgressReducer(
  downloadsInProgress: DownloadProgress[],
  action:
    | { type: "add"; payload: DownloadProgress }
    | { type: "progress"; payload: { id: string; progress: number } }
    | { type: "complete"; payload: { id: string } }
    | { type: "error"; payload: { id: string; errorMessage?: string } }
    | { type: "remove"; payload: { id: string } }
): DownloadProgress[] {
  const getProgressIndex = () =>
    downloadsInProgress.findIndex(
      (download) => download.id === action.payload.id
    )
  switch (action.type) {
  case "add": {
    return [...downloadsInProgress, action.payload]
  }
  case "progress": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      downloadsInProgress[progressIndex].progress = action.payload.progress
      return [...downloadsInProgress]
    } else {
      return downloadsInProgress
    }
  }
  case "complete": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      downloadsInProgress[progressIndex].complete = true
      return [...downloadsInProgress]
    } else {
      return downloadsInProgress
    }
  }
  case "error": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      downloadsInProgress[progressIndex].error = true
      downloadsInProgress[progressIndex].errorMessage =
          action.payload.errorMessage
      return [...downloadsInProgress]
    } else {
      return downloadsInProgress
    }
  }
  case "remove": {
    const progressIndex = getProgressIndex()
    if (progressIndex > -1) {
      downloadsInProgress.splice(progressIndex, 1)
      return [...downloadsInProgress]
    } else {
      return downloadsInProgress
    }
  }
  default:
    return downloadsInProgress
  }
}

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
