
export type ToastType = "success" | "error"

export interface Toast {
  id: string
  type: ToastType
  title: string
  subtitle?: string
  progress?: number
  onProgressCancel?(): void
}