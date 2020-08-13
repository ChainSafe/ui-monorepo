import { IToast } from 'src/components/organisms/toast/Toast'

export const SHOW_TOAST = '@engaze/toast/show'
export const SHOW_TOAST_ERROR = '@engaze/toast/show_error'

interface IErrorData {
  message: string
  description?: string
  placement?: string
}

export interface IToastErrorAction {
  type: typeof SHOW_TOAST_ERROR
  payload: IErrorData
}

export function showToastAction(toast: IToast) {
  return {
    type: SHOW_TOAST,
    payload: toast
  }
}

export function showErrorToastAction(errorData: IErrorData): IToastErrorAction {
  return {
    type: SHOW_TOAST_ERROR,
    payload: errorData
  }
}
