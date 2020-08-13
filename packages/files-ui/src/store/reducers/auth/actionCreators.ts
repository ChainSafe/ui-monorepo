// auth
import { Dispatch } from 'redux'
import {
  setTokensLocal,
  setUserLocal,
  removeLocalStorageOnLogout,
  removeUserAndTokenLocal
} from 'src/util/localstorage'
import { GetState, AsyncDispatch } from '../../store'
import {
  getProfileApi,
  loginApi,
  ILoginApiError,
  IGetProfileApiError,
  signupApi,
  ISignupApiError,
  updateProfileApi,
  IUpdateProfileApiError,
  verifyEmailApi,
  IVerifyEmailApiError,
  resendVerificationEmailApi,
  IResendVerifyEmailApiError,
  changePasswordApi,
  IChangePassApiError,
  forgotPasswordApi,
  IForgotPasswordApiError,
  resetPasswordApi,
  IResetPasswordApiError,
  verifyResetTokenApi,
  IVerifyResetApiError
} from 'src/apiLib/userApi'
import { handleApiErr, handleApiErrPublic } from '../../../apiLib/errorResponse'
import { IUser } from '../../../types'
import { showErrorToastAction, showToastAction } from '../toast/actionCreators'
import { IWeb3AuthAction } from './web3/constants'

export const LOGIN_LOADING = '@@files/auth/login_loading'
export const LOGIN_SUCCESS = '@@files/auth/login_success'
export const LOGIN_FAIL = '@@files/auth/login_failed'

export const SIGNUP_LOADING = '@@files/auth/signup_loading'
export const SIGNUP_SUCCESS = '@@files/auth/signup_success'
export const SIGNUP_FAIL = '@@files/auth/signup_failed'

export const SET_USER = '@@files/auth/set_user'

export const PROFILE_LOADING = '@@files/profile/loading'
export const PROFILE_SUCCESS = '@@files/profile/success'
export const PROFILE_FAIL = '@@files/profile/fail'

export const UPDATE_PROFILE_LOADING = '@@files/profile/update_loading'
export const UPDATE_PROFILE_SUCCESS = '@@files/profile/update_success'
export const UPDATE_PROFILE_FAIL = '@@files/profile/update_fail'

export const VERIFY_EMAIL_LOADING = '@@files/profile/verify_email_loading'
export const VERIFY_EMAIL_SUCCESS = '@@files/profile/verify_email_success'
export const VERIFY_EMAIL_FAIL = '@@files/profile/verify_email_fail'

export const RESEND_VERIFICATION_LOADING =
  '@@files/profile/resend_verification_loading'
export const RESEND_VERIFICATION_SUCCESS =
  '@@files/profile/resend_verification_success'
export const RESEND_VERIFICATION_FAIL =
  '@@files/profile/resend_verification_fail'

export const CHANGE_PASSWORD_LOADING = '@@files/profile/change_password_loading'
export const CHANGE_PASSWORD_SUCCESS = '@@files/profile/change_password_success'
export const CHANGE_PASSWORD_FAIL = '@@files/profile/change_password_fail'

export const FORGOT_PASSWORD_LOADING = '@@files/profile/forgot_password_loading'
export const FORGOT_PASSWORD_SUCCESS = '@@files/profile/forgot_password_success'
export const FORGOT_PASSWORD_FAIL = '@@files/profile/forgot_password_fail'

export const RESET_VERIFY_LOADING = '@@files/profile/reset_verify_loading'
export const RESET_VERIFY_SUCCESS = '@@files/profile/reset_verify_success'
export const RESET_VERIFY_FAIL = '@@files/profile/reset_verify_fail'

export const RESET_PASSWORD_LOADING = '@@files/profile/reset_password_loading'
export const RESET_PASSWORD_SUCCESS = '@@files/profile/reset_password_success'
export const RESET_PASSWORD_FAIL = '@@files/profile/reset_password_fail'

export const LOGOUT = '@@files/auth/logout'

interface ILoginLoadingAction {
  type: typeof LOGIN_LOADING
}

interface ILoginSuccessAction {
  type: typeof LOGIN_SUCCESS
  payload: IUser
}

interface ILoginFailAction {
  type: typeof LOGIN_FAIL
  payload: string
}

export function loginApiAction(
  email: string,
  password: string,
  onSuccess?: Function
) {
  return (dispatch: AsyncDispatch) => {
    dispatch({ type: LOGIN_LOADING })
    loginApi({ email, password })
      .then(loginData => {
        setTokensLocal(
          loginData.access_token.token,
          loginData.refresh_token.token
        )
        getProfileApi()
          .then(profileData => {
            const myProfile: IUser = {
              id: profileData.id,
              firstName: profileData.first_name,
              lastName: profileData.last_name,
              email: profileData.email,
              verified: profileData.verified,
              billing: profileData.payment_active,
              address: profileData.public_address,
              emailChanged: profileData.last_email_change,
              joinedDate: profileData.created_at
            }
            setUserLocal(myProfile)
            dispatch({
              type: LOGIN_SUCCESS,
              payload: myProfile
            })
            if (onSuccess) onSuccess()
          })
          .catch((err: IGetProfileApiError) => {
            const { message, data } = handleApiErr(err, dispatch)
            removeUserAndTokenLocal()
            dispatch({
              type: LOGIN_FAIL,
              payload: data?.server || message || 'Login failed'
            })
          })
      })
      .catch((err: ILoginApiError) => {
        const { message, data } = handleApiErrPublic(err)
        dispatch({
          type: LOGIN_FAIL,
          payload:
            data?.server ||
            data?.email ||
            data?.password ||
            data?.general ||
            message ||
            'Login failed'
        })
      })
  }
}

interface ISignupLoadingAction {
  type: typeof SIGNUP_LOADING
}

interface ISignupSuccessAction {
  type: typeof SIGNUP_SUCCESS
}

interface ISignupFailAction {
  type: typeof SIGNUP_FAIL
  payload: string
}

interface ISignupInputs {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
}

export function signupApiAction(
  signupInputs: ISignupInputs,
  onSuccess?: Function
) {
  return (dispatch: AsyncDispatch) => {
    const signupApiInputs = {
      first_name: signupInputs.firstName,
      last_name: signupInputs.lastName,
      email: signupInputs.email,
      password: signupInputs.password,
      password_confirm: signupInputs.passwordConfirm
    }
    dispatch({ type: SIGNUP_LOADING })
    signupApi(signupApiInputs)
      .then(() => {
        dispatch({ type: SIGNUP_SUCCESS })
        loginApi({ email: signupInputs.email, password: signupInputs.password })
          .then(loginData => {
            setTokensLocal(
              loginData.access_token.token,
              loginData.refresh_token.token
            )
            getProfileApi()
              .then(profileData => {
                const myProfile: IUser = {
                  id: profileData.id,
                  firstName: profileData.first_name,
                  lastName: profileData.last_name,
                  email: profileData.email,
                  verified: profileData.verified,
                  billing: profileData.payment_active,
                  address: profileData.public_address,
                  emailChanged: profileData.last_email_change,
                  joinedDate: profileData.created_at
                }
                setUserLocal(myProfile)
                dispatch({
                  type: LOGIN_SUCCESS,
                  payload: myProfile
                })
                if (onSuccess) onSuccess()
              })
              .catch((err: IGetProfileApiError) => {
                const { message, data } = handleApiErr(err, dispatch)
                removeUserAndTokenLocal()
                dispatch({
                  type: LOGIN_FAIL,
                  payload: data?.server || message || 'Login failed'
                })
              })
          })
          .catch((err: ILoginApiError) => {
            const { message, data } = handleApiErrPublic(err)
            dispatch({
              type: LOGIN_FAIL,
              payload: data?.server || message || 'Login failed'
            })
          })
      })
      .catch((err: ISignupApiError) => {
        const { message, data } = handleApiErrPublic(err)
        dispatch({
          type: SIGNUP_FAIL,
          payload:
            data?.server ||
            data?.email ||
            data?.password ||
            message ||
            'Signup failed'
        })
      })
  }
}

interface IProfileLoading {
  type: typeof PROFILE_LOADING
}

interface IProfileSuccess {
  type: typeof PROFILE_SUCCESS
  payload: IUser
}

interface IProfileFail {
  type: typeof PROFILE_FAIL
  payload: string
}

export function getProfileApiAction(forceFetch: boolean) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const { profile } = getState().auth
    if (!profile || forceFetch) {
      dispatch({
        type: PROFILE_LOADING
      })

      getProfileApi()
        .then(profileData => {
          const user: IUser = {
            id: profileData.id,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            email: profileData.email,
            verified: profileData.verified,
            billing: profileData.payment_active,
            address: profileData.public_address,
            emailChanged: profileData.last_email_change,
            joinedDate: profileData.created_at
          }
          setUserLocal(user)
          dispatch({
            type: PROFILE_SUCCESS,
            payload: user
          })
        })
        .catch((err: IGetProfileApiError) => {
          const { message, data } = handleApiErr(err, dispatch)
          dispatch({
            type: PROFILE_FAIL,
            payload: data?.server || message || 'Profile error'
          })
        })
    }
  }
}

export function getProfileInitApiAction(forceFetch: boolean) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const { profile } = getState().auth
    if (!profile || forceFetch) {
      getProfileApi()
        .then(profileData => {
          const user: IUser = {
            id: profileData.id,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            email: profileData.email,
            verified: profileData.verified,
            billing: profileData.payment_active,
            address: profileData.public_address,
            emailChanged: profileData.last_email_change,
            joinedDate: profileData.created_at
          }
          setUserLocal(user)
          dispatch({
            type: PROFILE_SUCCESS,
            payload: user
          })
        })
        .catch((err: IGetProfileApiError) => {
          const { message, data } = handleApiErr(err, dispatch)
          dispatch({
            type: PROFILE_FAIL,
            payload: data?.server || message || 'Profile error'
          })
          removeLocalStorageOnLogout()
          dispatch(logoutAction())
        })
    }
  }
}

interface ISetUserAction {
  type: typeof SET_USER
  payload: IUser
}

export function setUserAction(user: IUser): ISetUserAction {
  setUserLocal(user)
  return {
    type: SET_USER,
    payload: user
  }
}

interface IUpdateProfileLoading {
  type: typeof UPDATE_PROFILE_LOADING
}

interface IUpdateProfileSuccess {
  type: typeof UPDATE_PROFILE_SUCCESS
  payload: IUser
}

interface IUpdateProfileFail {
  type: typeof UPDATE_PROFILE_FAIL
  payload: string
}

export function updateProfileApiAction(
  firstName: string,
  lastName: string,
  email: string
) {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: UPDATE_PROFILE_LOADING
    })

    updateProfileApi(firstName, lastName, email)
      .then(profileData => {
        const user: IUser = {
          id: profileData.id,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          email: profileData.email,
          verified: profileData.verified,
          billing: profileData.payment_active,
          address: profileData.public_address,
          emailChanged: profileData.last_email_change,
          joinedDate: profileData.created_at
        }
        setUserLocal(user)
        dispatch({
          type: UPDATE_PROFILE_SUCCESS,
          payload: user
        })
        dispatch(
          showToastAction({
            message: 'Profile updated',
            type: 'success',
            placement: 'topRight'
          })
        )
      })
      .catch((err: IUpdateProfileApiError) => {
        const { message, data } = handleApiErr(err, dispatch)
        const errorMessage =
          data?.email ||
          data?.general ||
          data?.server ||
          message ||
          'Profile update failed'
        dispatch({
          type: UPDATE_PROFILE_FAIL,
          payload: errorMessage
        })
        dispatch(
          showErrorToastAction({
            message: errorMessage
          })
        )
      })
  }
}

interface IVerifyEmailLoading {
  type: typeof VERIFY_EMAIL_LOADING
}

interface IVerifyEmailSuccess {
  type: typeof VERIFY_EMAIL_SUCCESS
  payload?: string
}

interface IVerifyEmailFail {
  type: typeof VERIFY_EMAIL_FAIL
  payload: string
}

export function verifyEmailApiAction(userId: string, token: string) {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: VERIFY_EMAIL_LOADING
    })

    const userIdNum = parseInt(userId)

    if (isNaN(userIdNum)) {
      dispatch({
        type: VERIFY_EMAIL_FAIL,
        payload: 'Email verification failed'
      })
      return
    }

    verifyEmailApi(userIdNum, token)
      .then(() => {
        const { profile } = getState().auth
        if (userId === profile?.id) {
          // the verified user is same as local user
          const user: IUser = {
            ...profile,
            verified: true
          }
          setUserLocal(user)
          dispatch({
            type: VERIFY_EMAIL_SUCCESS,
            payload: userId.toString()
          })
        } else {
          dispatch({
            type: VERIFY_EMAIL_SUCCESS
          })
        }
      })
      .catch((err: IVerifyEmailApiError) => {
        const { message, data } = handleApiErr(err, dispatch)
        const errorMessage =
          data?.email || data?.server || message || 'Email verification failed'
        dispatch({
          type: VERIFY_EMAIL_FAIL,
          payload: errorMessage
        })
      })
  }
}

interface IResendVerificationLoading {
  type: typeof RESEND_VERIFICATION_LOADING
}

interface IResendVerificationSuccess {
  type: typeof RESEND_VERIFICATION_SUCCESS
}

interface IResendVerificationFail {
  type: typeof RESEND_VERIFICATION_FAIL
}

export function resendVerificationApiAction() {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: RESEND_VERIFICATION_LOADING
    })

    resendVerificationEmailApi()
      .then(() => {
        dispatch({
          type: RESEND_VERIFICATION_SUCCESS
        })
      })
      .catch((err: IResendVerifyEmailApiError) => {
        const { message, data } = handleApiErr(err, dispatch)
        const errorMessage =
          data?.email || data?.server || message || 'Email resend failed'
        dispatch({
          type: RESEND_VERIFICATION_FAIL
        })
        dispatch(
          showErrorToastAction({
            message: errorMessage
          })
        )
      })
  }
}

interface IChangePasswordLoading {
  type: typeof CHANGE_PASSWORD_LOADING
}

interface IChangePasswordSuccess {
  type: typeof CHANGE_PASSWORD_SUCCESS
}

interface IChangePasswordFail {
  type: typeof CHANGE_PASSWORD_FAIL
}

export function changePasswordApiAction(
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
  onSuccess: Function
) {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: CHANGE_PASSWORD_LOADING
    })

    changePasswordApi(oldPassword, newPassword, newPasswordConfirm)
      .then(() => {
        dispatch({
          type: CHANGE_PASSWORD_SUCCESS
        })
        dispatch(
          showToastAction({
            message: 'Password changed successfully',
            type: 'success',
            placement: 'topRight'
          })
        )
        onSuccess()
      })
      .catch((err: IChangePassApiError) => {
        const { message, data } = handleApiErr(err, dispatch)

        const errorMessage =
          data?.password ||
          data?.old_password ||
          data?.new_password ||
          data?.server ||
          message ||
          'Change password failed'

        dispatch({
          type: CHANGE_PASSWORD_FAIL
        })
        dispatch(
          showErrorToastAction({
            message: errorMessage
          })
        )
      })
  }
}

interface IForgotPasswordLoading {
  type: typeof FORGOT_PASSWORD_LOADING
}

interface IForgotPasswordSuccess {
  type: typeof FORGOT_PASSWORD_SUCCESS
}

interface IForgotPasswordFail {
  type: typeof FORGOT_PASSWORD_FAIL
}

export function forgotPasswordApiAction(
  email: string,
  onSuccess?: Function,
  onFail?: Function
) {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: FORGOT_PASSWORD_LOADING
    })

    forgotPasswordApi(email)
      .then(() => {
        dispatch({
          type: FORGOT_PASSWORD_SUCCESS
        })
        if (onSuccess) onSuccess()
      })
      .catch((err: IForgotPasswordApiError) => {
        const { message, data } = handleApiErr(err, dispatch)
        const errorMessage =
          data?.email ||
          data?.general ||
          data?.server ||
          message ||
          'Reset password failed'

        dispatch({
          type: FORGOT_PASSWORD_FAIL
        })
        if (onFail) onFail(errorMessage)
      })
  }
}

interface IResetTokenVerifyLoading {
  type: typeof RESET_VERIFY_LOADING
}

interface IResetTokenVerifySuccess {
  type: typeof RESET_VERIFY_SUCCESS
}

interface IResetTokenVerifyFail {
  type: typeof RESET_VERIFY_FAIL
}

export function resetTokenVerifyApiAction(id: number, token: string) {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: RESET_VERIFY_LOADING
    })

    verifyResetTokenApi(id, token)
      .then(() => {
        dispatch({
          type: RESET_VERIFY_SUCCESS
        })
      })
      .catch((err: IVerifyResetApiError) => {
        const { message, data } = handleApiErr(err, dispatch)

        const errorMessage =
          data?.token ||
          data?.general ||
          data?.server ||
          message ||
          'Reset password failed'

        dispatch({
          type: RESET_VERIFY_FAIL
        })
        dispatch(
          showErrorToastAction({
            message: errorMessage
          })
        )
      })
  }
}

interface IResetPasswordLoading {
  type: typeof RESET_PASSWORD_LOADING
}

interface IResetPasswordSuccess {
  type: typeof RESET_PASSWORD_SUCCESS
}

interface IResetPasswordFail {
  type: typeof RESET_PASSWORD_FAIL
}

export function resetPasswordApiAction(
  id: number,
  token: string,
  password: string,
  passwordConfirm: string,
  onSuccess?: Function,
  onFail?: Function
) {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: RESET_PASSWORD_LOADING
    })

    resetPasswordApi(id, token, password, passwordConfirm)
      .then(() => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS
        })
        if (onSuccess) onSuccess()
      })
      .catch((err: IResetPasswordApiError) => {
        const { message, data } = handleApiErr(err, dispatch)

        const errorMessage =
          data?.token ||
          data?.general ||
          data?.server ||
          message ||
          'Reset password failed'

        dispatch({
          type: RESET_PASSWORD_FAIL
        })
        if (onFail) {
          onFail(errorMessage)
        } else {
          dispatch(
            showErrorToastAction({
              message: errorMessage
            })
          )
        }
      })
  }
}

interface ILogoutAction {
  type: typeof LOGOUT
}

interface ILogoutAction {
  type: typeof LOGOUT
}

export function logoutAction() {
  return {
    type: LOGOUT
  }
}

export function logoutAndReset() {
  return (dispatch: Dispatch) => {
    removeLocalStorageOnLogout()
    dispatch(logoutAction())
  }
}

export type IAuthAction =
  | ILoginLoadingAction
  | ILoginSuccessAction
  | ILoginFailAction
  | ISignupLoadingAction
  | ISignupSuccessAction
  | ISignupFailAction
  | ILogoutAction
  | ISetUserAction
  | IProfileLoading
  | IProfileSuccess
  | IProfileFail
  | IUpdateProfileLoading
  | IUpdateProfileSuccess
  | IUpdateProfileFail
  | IVerifyEmailLoading
  | IVerifyEmailSuccess
  | IVerifyEmailFail
  | IResendVerificationLoading
  | IResendVerificationSuccess
  | IResendVerificationFail
  | IChangePasswordLoading
  | IChangePasswordSuccess
  | IChangePasswordFail
  | IForgotPasswordLoading
  | IForgotPasswordSuccess
  | IForgotPasswordFail
  | IResetTokenVerifyLoading
  | IResetTokenVerifySuccess
  | IResetTokenVerifyFail
  | IResetPasswordLoading
  | IResetPasswordSuccess
  | IResetPasswordFail
  | IWeb3AuthAction
