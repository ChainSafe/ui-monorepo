import { publicAPICall, privateAPICall } from './apiRequest'
import { convertErrors } from './errorResponse'
import { AxiosError } from 'axios'
import {
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  GET_PROFILE_ROUTE,
  VERIFY_EMAIL_ROUTE,
  UPDATE_PROFILE,
  CHANGE_PASSWORD_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  VERIFY_RESET_TOKEN_ROUTE,
  RESEND_VERIFICATION_EMAIL_ROUTE,
  RESET_PASSWORD_ROUTE,
  WEB3_LOGIN
} from './apiRoutes'

interface ILoginInput {
  email: string
  password: string
}

export interface IToken {
  token: string
  expires: string
}

interface ILoginApiData {
  access_token: {
    token: string
  }
  refresh_token: {
    token: string
  }
}

interface ILoginErrorApi {
  general?: string
  email?: string
  password?: string
  server?: string
}

export type ILoginApiError = AxiosError<ILoginErrorApi>

export async function loginApi(inputs: ILoginInput) {
  return new Promise<ILoginApiData>((resolve, reject) => {
    publicAPICall
      .post(LOGIN_ROUTE, inputs)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

interface ISignup {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirm: string
}

interface ISignupError {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  server?: string
}

export type ISignupApiError = AxiosError<ISignupError>

export function signupApi(inputs: ISignup) {
  return new Promise((resolve, reject) => {
    publicAPICall
      .post(SIGNUP_ROUTE, inputs)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

interface IProfileResponse {
  first_name: string
  last_name: string
  id: string
  email: string
  verified: boolean
  payment_active: boolean
  created_at: Date
  public_address: string
  last_email_change: Date
}

export type IGetProfileApiError = AxiosError<{
  server?: string
}>

export function getProfileApi() {
  return new Promise<IProfileResponse>((resolve, reject) => {
    privateAPICall
      .get(GET_PROFILE_ROUTE)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IUpdateProfileApiError = AxiosError<{
  email?: string
  server?: string
  general?: string
  first_name?: string
  last_name?: string
  username?: string
}>

export function updateProfileApi(
  firstName: string,
  lastName: string,
  email: string
) {
  return new Promise<IProfileResponse>((resolve, reject) => {
    privateAPICall
      .patch(UPDATE_PROFILE, {
        first_name: firstName,
        last_name: lastName,
        email
      })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IVerifyEmailApiError = AxiosError<{
  token?: string
  email?: string
  server?: string
}>

export function verifyEmailApi(id: number, token: string) {
  return new Promise((resolve, reject) => {
    publicAPICall
      .post(VERIFY_EMAIL_ROUTE, { id, token })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IResendVerifyEmailApiError = AxiosError<{
  general?: string
  server?: string
  email?: string
}>

export function resendVerificationEmailApi() {
  return new Promise((resolve, reject) => {
    privateAPICall
      .get(RESEND_VERIFICATION_EMAIL_ROUTE)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export interface IChangePassError {
  password?: string
  old_password?: string
  new_password?: string
  server?: string
}

export type IChangePassApiError = AxiosError<IChangePassError>

export function changePasswordApi(
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
) {
  return new Promise((resolve, reject) => {
    privateAPICall
      .patch(CHANGE_PASSWORD_ROUTE, {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: confirmNewPassword
      })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IForgotPasswordApiError = AxiosError<{
  general?: string
  server?: string
  email?: string
}>

export function forgotPasswordApi(email: string) {
  return new Promise((resolve, reject) => {
    publicAPICall
      .get(FORGOT_PASSWORD_ROUTE(email))
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IVerifyResetApiError = AxiosError<{
  token?: string
  general?: string
  server?: string
}>

export function verifyResetTokenApi(id: number, token: string) {
  return new Promise((resolve, reject) => {
    privateAPICall
      .post(VERIFY_RESET_TOKEN_ROUTE, { id, token })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IResetPasswordApiError = AxiosError<{
  token?: string
  general?: string
  server?: string
}>

export function resetPasswordApi(
  id: number,
  token: string,
  password: string,
  passwordConfirm: string
) {
  return new Promise((resolve, reject) => {
    publicAPICall
      .post(RESET_PASSWORD_ROUTE, {
        id,
        token,
        password,
        password_confirm: passwordConfirm
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(convertErrors(err))
      })
  })
}

export type IGetWeb3LoginError = AxiosError<{
  token?: string
  general?: string
  server?: string
}>

export const getWeb3LoginTokenApi = async (): Promise<IToken> => {
  try {
    return (await privateAPICall.get(WEB3_LOGIN)).data
  } catch (error) {
    throw convertErrors(error)
  }
}

export const postWeb3LoginApi = async (
  public_address: string,
  token: string,
  signature: string
): Promise<ILoginApiData> => {
  try {
    return (
      await privateAPICall.post(WEB3_LOGIN, {
        public_address: public_address,
        token: token,
        signature: signature
      })
    ).data
  } catch (error) {
    throw convertErrors(error)
  }
}
