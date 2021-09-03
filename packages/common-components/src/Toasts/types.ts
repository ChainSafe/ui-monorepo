
export type ToastType = "success" | "error"

export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"
export interface Toast {
  id: string
  type: ToastType
  title: string
  subtitle?: string
  progress?: number
  onProgressCancel?(): void
}