
export type ToastType = "success" | "error"

export type ToastPosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
export interface Toast {
  id: string
  type: ToastType
  title: string
  subtitle?: string
  progress?: number
  onProgressCancel?: () => void
  isClosable?: boolean
  onProgressCancelLoading?: boolean
  toastPosition: ToastPosition
  autoDismiss?: boolean
  dismissTimeout?: number
  testId?: string
}

export type ToastContentData = Omit<Toast, "toastPosition" | "autoDismiss" | "dismissTimeout">

export interface ToastParams extends Omit<Toast, "id" | "toastPosition"> {
  toastPosition?: ToastPosition
}
