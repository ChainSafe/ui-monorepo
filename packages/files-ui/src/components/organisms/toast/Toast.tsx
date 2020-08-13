import { notification } from 'src/components/kit'

export declare type NotificationPlacement =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
export declare type Type = 'success' | 'info' | 'error' | 'warning'

export interface IToast {
  type: Type
  placement: NotificationPlacement
  message: string
  description?: string
}

const showToast = (props: IToast) => {
  notification[props.type]({
    message: props.message,
    description: props.description,
    placement: props.placement
  })
}

export { showToast }
