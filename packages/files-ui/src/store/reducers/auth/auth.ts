import {
  LOGOUT,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_LOADING,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  SET_USER,
  PROFILE_LOADING,
  PROFILE_SUCCESS,
  PROFILE_FAIL,
  UPDATE_PROFILE_LOADING,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  VERIFY_EMAIL_LOADING,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAIL,
  RESEND_VERIFICATION_LOADING,
  RESEND_VERIFICATION_SUCCESS,
  RESEND_VERIFICATION_FAIL,
  FORGOT_PASSWORD_LOADING,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_VERIFY_LOADING,
  RESET_VERIFY_SUCCESS,
  RESET_VERIFY_FAIL,
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  IAuthAction
} from './actionCreators'
import { getUserAndTokenLocal } from '../../../util/localstorage'
import { IUser } from '../../../types'
import {
  CHANGE_PASSWORD_LOADING,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL
} from 'src/store/actionCreators'
import { WEB3_SIGNIN, IWeb3AuthAction } from './web3/constants'

export interface IAuth {
  profile: IUser | null
  isAuthenticated: boolean | null

  loginLoading: boolean
  loginError: string

  signupLoading: boolean
  signupError: string

  profileLoading: boolean
  profileError: string

  profileUpdating: boolean
  profileUpdateError: string

  verifyingEmail: boolean
  verifyEmailError: string
  emailJustVerified: boolean | null

  resendVerificationLoading: boolean
  changingPassword: boolean
  forgotPasswordLoading: boolean
  resetVerifyLoading: boolean
  resetPasswordLoading: boolean
}

const initializer: IAuth = {
  profile: null,
  isAuthenticated: false,

  loginLoading: false,
  loginError: '',

  signupLoading: false,
  signupError: '',

  profileLoading: false,
  profileError: '',

  profileUpdating: false,
  profileUpdateError: '',

  verifyingEmail: false,
  verifyEmailError: '',
  emailJustVerified: null,

  resendVerificationLoading: false,
  changingPassword: false,
  forgotPasswordLoading: false,
  resetVerifyLoading: false,
  resetPasswordLoading: false
}

let initialState = initializer
const localData = getUserAndTokenLocal()

if (localData) {
  initialState = {
    ...initializer,
    profile: localData.user,
    isAuthenticated: true
  }
}

export default (state = initialState, action: IAuthAction): IAuth => {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        profile: action.payload
      }
    }
    case LOGOUT: {
      return {
        ...state,
        profile: null,
        isAuthenticated: false
      }
    }
    case LOGIN_LOADING: {
      return {
        ...state,
        loginLoading: true,
        loginError: ''
      }
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        profile: action.payload,
        isAuthenticated: true,
        loginLoading: false,
        loginError: ''
      }
    }
    case WEB3_SIGNIN: {
      return {
        ...state,
        profile: (action as IWeb3AuthAction).payload,
        isAuthenticated: true,
        loginLoading: false,
        loginError: ''
      }
    }
    case LOGIN_FAIL: {
      return {
        ...state,
        loginLoading: false,
        loginError: action.payload as string
      }
    }
    case SIGNUP_LOADING: {
      return {
        ...state,
        signupLoading: true,
        signupError: ''
      }
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        signupLoading: false,
        signupError: ''
      }
    }
    case SIGNUP_FAIL: {
      return {
        ...state,
        signupLoading: false,
        signupError: action.payload as string
      }
    }
    case PROFILE_LOADING: {
      return {
        ...state,
        profileLoading: true,
        profileError: ''
      }
    }
    case PROFILE_SUCCESS: {
      return {
        ...state,
        profile: action.payload,
        profileLoading: false,
        profileError: ''
      }
    }
    case PROFILE_FAIL: {
      return {
        ...state,
        profile: null,
        profileError: action.payload as string,
        profileLoading: false
      }
    }
    case UPDATE_PROFILE_LOADING: {
      return {
        ...state,
        profileUpdating: true,
        profileUpdateError: ''
      }
    }
    case UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        profile: action.payload,
        profileUpdating: false,
        profileUpdateError: ''
      }
    }
    case UPDATE_PROFILE_FAIL: {
      return {
        ...state,
        profileUpdating: false,
        profileUpdateError: action.payload as string
      }
    }
    case VERIFY_EMAIL_LOADING: {
      return {
        ...state,
        verifyingEmail: true,
        verifyEmailError: '',
        emailJustVerified: null
      }
    }
    case VERIFY_EMAIL_SUCCESS: {
      if (action.payload && state.profile) {
        return {
          ...state,
          profile: {
            ...state.profile,
            verified: true
          },
          verifyingEmail: false,
          verifyEmailError: '',
          emailJustVerified: true
        }
      } else {
        return {
          ...state,
          verifyingEmail: false,
          verifyEmailError: '',
          emailJustVerified: true
        }
      }
    }
    case VERIFY_EMAIL_FAIL: {
      return {
        ...state,
        verifyingEmail: false,
        verifyEmailError: action.payload,
        emailJustVerified: false
      }
    }
    case RESEND_VERIFICATION_LOADING: {
      return {
        ...state,
        resendVerificationLoading: true
      }
    }
    case RESEND_VERIFICATION_SUCCESS: {
      return {
        ...state,
        resendVerificationLoading: false
      }
    }
    case RESEND_VERIFICATION_FAIL: {
      return {
        ...state,
        resendVerificationLoading: false
      }
    }
    case CHANGE_PASSWORD_LOADING: {
      return {
        ...state,
        changingPassword: true
      }
    }
    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        changingPassword: false
      }
    }
    case CHANGE_PASSWORD_FAIL: {
      return {
        ...state,
        changingPassword: false
      }
    }
    case FORGOT_PASSWORD_LOADING: {
      return {
        ...state,
        forgotPasswordLoading: true
      }
    }
    case FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        forgotPasswordLoading: false
      }
    }
    case FORGOT_PASSWORD_FAIL: {
      return {
        ...state,
        forgotPasswordLoading: false
      }
    }
    case RESET_VERIFY_LOADING: {
      return {
        ...state,
        resetVerifyLoading: true
      }
    }
    case RESET_VERIFY_SUCCESS: {
      return {
        ...state,
        resetVerifyLoading: false
      }
    }
    case RESET_VERIFY_FAIL: {
      return {
        ...state,
        resetVerifyLoading: false
      }
    }
    case RESET_PASSWORD_LOADING: {
      return {
        ...state,
        resetPasswordLoading: true
      }
    }
    case RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        resetPasswordLoading: false
      }
    }
    case RESET_PASSWORD_FAIL: {
      return {
        ...state,
        resetPasswordLoading: false
      }
    }
    default:
      return state
  }
}
