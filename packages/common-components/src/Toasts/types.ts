
export type ToastType = "success" | "error"

export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"
export interface Toast {
  id: string
  type: ToastType
  title: string
  subtitle?: string
  progress?: number
  onProgressCancel?(): void
  toastPosition?: ToastPosition,
  autoDismiss?: boolean,
  dismissTimeout?: number
}

export type AddToast = Omit<Toast, "id">
