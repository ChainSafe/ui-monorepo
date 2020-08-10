import { showToast } from 'src/components/organisms/toast/Toast'
import { SHOW_TOAST, SHOW_TOAST_ERROR } from './actionCreators'

const initialState = {}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case SHOW_TOAST: {
      showToast(action.payload)
      return state
    }
    case SHOW_TOAST_ERROR: {
      showToast({
        type: 'error',
        placement: action.payload.placement || 'topRight',
        message: action.payload.message,
        description: action.payload.description
      })
      return state
    }
    default:
      return null
  }
}
