import { logoutAndReset } from '../store/actionCreators'
import { AxiosError } from 'axios'
import { ThunkDispatch } from 'redux-thunk'
import { AppState } from '../store/store'
import { Action } from 'redux'

interface IErrorResponse<T> {
  status: number
  message: string
  data?: T
}

interface IServerError {
  type: string
  message: string
}

export function convertErrors(errors: AxiosError<IServerError[] | undefined>) {
  if (errors && errors.response && errors.response.data) {
    if (Array.isArray(errors.response.data)) {
      const normalized: any = {}
      errors.response.data.forEach(error => {
        normalized[error.type] = error.message
      })
      errors.response.data = normalized
    } else {
      errors.response.data = undefined
    }
  }
  return errors
}

export type IErrorApi = AxiosError

// for protected routes - dispatches logout
export function handleApiErr<U>(
  err: AxiosError<U>,
  dispatch: ThunkDispatch<AppState, void, Action>
): IErrorResponse<U> {
  if (err.response && err.response.status) {
    switch (err.response.status) {
      case 500:
        // dispatch(logoutAndReset());
        return { status: 500, message: 'Server error', data: err.response.data }
      case 401: {
        dispatch(logoutAndReset())
        return { status: 401, message: '', data: err.response.data }
      }
      case 400: {
        return { status: 400, message: '', data: err.response.data }
      }
      case 403: {
        return { status: 403, message: 'Forbidden', data: err.response.data }
      }
      default:
        return {
          status: err.response.status,
          message: 'Something went wrong',
          data: err.response.data
        }
    }
  } else {
    return { status: 504, message: 'Unknown error' }
  }
}

// for public routes - DOES NOT dispatch logout
export function handleApiErrPublic<U>(err: AxiosError<U>): IErrorResponse<U> {
  if (err.response && err.response.status) {
    switch (err.response.status) {
      case 500:
        return { status: 500, message: 'Server error', data: err.response.data }
      case 401: {
        return { status: 401, message: '', data: err.response.data }
      }
      case 400: {
        return { status: 400, message: '', data: err.response.data }
      }
      case 403: {
        return { status: 403, message: 'Forbidden', data: err.response.data }
      }
      default:
        return {
          status: err.response.status,
          message: 'Something went wrong',
          data: err.response.data
        }
    }
  } else {
    return { status: 504, message: 'Unknown error' }
  }
}
