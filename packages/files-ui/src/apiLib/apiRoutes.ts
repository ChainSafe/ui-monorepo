import config from '../config/config'

export const REFRESH_ROUTE = (refreshToken: string | null) =>
  `${config.API}/api/v1/user/refresh/${refreshToken}`
export const LOGIN_ROUTE = `${config.API}/api/v1/user/login`
export const SIGNUP_ROUTE = `${config.API}/api/v1/user/signup`
export const GET_PROFILE_ROUTE = `${config.API}/api/v1/user/`
export const VERIFY_EMAIL_ROUTE = `${config.API}/api/v1/user/email/verify`
export const RESEND_VERIFICATION_EMAIL_ROUTE = `${config.API}/api/v1/user/email/verify`
export const UPDATE_PROFILE = `${config.API}/api/v1/user/`
export const CHANGE_PASSWORD_ROUTE = `${config.API}/api/v1/user/password/change`
export const FORGOT_PASSWORD_ROUTE = (email: string) =>
  `${config.API}/api/v1/user/password/reset/${email}`
export const VERIFY_RESET_TOKEN_ROUTE = `${config.API}/api/v1/user/password/reset/verify`
export const RESET_PASSWORD_ROUTE = `${config.API}/api/v1/user/password/reset`

export const STRIPE_ADD_CARD = 'https://api.stripe.com/v1/tokens'
export const ADD_CARD_ROUTE = `${config.API}/api/v1/billing/card/add`
export const GET_CARDS_ROUTE = `${config.API}/api/v1/billing/cards`
export const SET_DEFAULT_CARD_ROUTE = `${config.API}/api/v1/billing/card/default`
export const REMOVE_CARD_ROUTE = (id: string) =>
  `${config.API}/api/v1/billing/card/${id}`

// TODO: billing information currently comes from drive, this should be refactored
export const BILLING_INFO = `${config.API}/api/v1/drive/info`
//

export const DRIVE_UPLOAD_ROUTE = `${config.API}/api/v1/drive/upload`
export const DRIVE_FILE_LIST_ROUTE = `${config.API}/api/v1/drive/files/ls`
export const DRIVE_FILE_INFO_ROUTE = `${config.API}/api/v1/drive/files/file`
export const DRIVE_FILE_DOWNLOAD = `${config.API}/api/v1/drive/download`
export const DRIVE_MKDIR = `${config.API}/api/v1/drive/files/mkdir`
export const DRIVE_DELETE_FILES = `${config.API}/api/v1/drive/files/rm`
export const DRIVE_DELETE_FOLDERS = `${config.API}/api/v1/drive/files/rm`
export const DRIVE_FILE_MOVE = `${config.API}/api/v1/drive/files/mv`

export const FPS_UPLOAD_BULK_ROUTE = `${config.API}/api/v1/fps/upload`
export const FPS_NOTIFICATION_ROUTE = `${config.API}/api/v1/fps/notifications`

export const WEB3_LOGIN = `${config.API}/api/v1/user/web3/login`
