import {
  loginApi,
  signupApi,
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
  verifyEmailApi,
  verifyResetTokenApi,
  resendVerificationEmailApi,
  resetPasswordApi,
  forgotPasswordApi
} from '../userApi'
import MockAdapter from 'axios-mock-adapter'
import { publicAPICall, privateAPICall } from '../apiRequest'
import {
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  GET_PROFILE_ROUTE,
  VERIFY_EMAIL_ROUTE,
  VERIFY_RESET_TOKEN_ROUTE,
  RESEND_VERIFICATION_EMAIL_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  RESET_PASSWORD_ROUTE,
  UPDATE_PROFILE
} from '../apiRoutes'

const mockPublic = new MockAdapter(publicAPICall)
const mockPrivate = new MockAdapter(privateAPICall)

describe('LOGIN API', () => {
  it('API should be called with success response', () => {
    const inputs = { email: 'ok', password: 'null' }

    mockPublic
      .onPost(LOGIN_ROUTE, inputs)
      .reply(200, [{ type: 'general', message: 'success' }])

    const spy = jest.spyOn(publicAPICall, 'post')
    return loginApi(inputs).then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('401 on wrong login credentials should be rejected', () => {
    const inputs = { email: 'ok', password: 'null' }

    mockPublic
      .onPost(LOGIN_ROUTE, inputs)
      .reply(401, [
        { type: 'general', message: 'email or password does not match' }
      ])

    const spy = jest.spyOn(publicAPICall, 'post')
    return loginApi(inputs).catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('SIGNUP API', () => {
  it('API should be called on successful response', () => {
    const inputs = {
      email: 'ok',
      password: 'null',
      first_name: 'Tom',
      last_name: 'bk',
      password_confirm: 'null'
    }

    mockPublic
      .onPost(SIGNUP_ROUTE, inputs)
      .reply(200, [{ type: 'general', message: 'success' }])

    const spy = jest.spyOn(publicAPICall, 'post')
    return signupApi(inputs).then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    const inputs = {
      email: 'ok',
      password: 'null',
      first_name: 'Tom',
      last_name: 'bk',
      password_confirm: 'null'
    }

    mockPublic
      .onPost(SIGNUP_ROUTE, inputs)
      .reply(400, [{ type: 'general', message: 'email already exists' }])

    const spy = jest.spyOn(publicAPICall, 'post')
    return signupApi(inputs).catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('GET PROFILE API', () => {
  it('API should be called on successful response', () => {
    mockPrivate.onGet(GET_PROFILE_ROUTE).reply(200, { email: 'test@test.com' })

    const spy = jest.spyOn(privateAPICall, 'get')
    return getProfileApi().then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onGet(GET_PROFILE_ROUTE)
      .reply(404, [{ type: 'general', message: 'Profile not found' }])

    const spy = jest.spyOn(privateAPICall, 'get')
    return getProfileApi().catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Verify email API', () => {
  it('API should be called on successful response', () => {
    mockPublic.onPost(VERIFY_EMAIL_ROUTE).reply(200, { message: 'success' })

    const spy = jest.spyOn(publicAPICall, 'post')
    return verifyEmailApi(1, 'token').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPublic
      .onPost(VERIFY_EMAIL_ROUTE)
      .reply(400, [{ type: 'token', message: 'Token invalid' }])

    const spy = jest.spyOn(publicAPICall, 'post')
    return verifyEmailApi(1, 'token').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('resend Verify email API', () => {
  it('API should be called on successful response', () => {
    mockPrivate
      .onGet(RESEND_VERIFICATION_EMAIL_ROUTE)
      .reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'get')
    return resendVerificationEmailApi().then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onGet(RESEND_VERIFICATION_EMAIL_ROUTE)
      .reply(400, [{ type: 'email', message: 'Email not found' }])

    const spy = jest.spyOn(privateAPICall, 'get')
    return resendVerificationEmailApi().catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Update profile API', () => {
  it('API should be called on successful response', () => {
    mockPrivate.onPatch(UPDATE_PROFILE).reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'patch')
    return updateProfileApi('first', 'last', 'email').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onPatch(UPDATE_PROFILE)
      .reply(400, [{ type: 'email', message: 'Email not found' }])

    const spy = jest.spyOn(privateAPICall, 'patch')
    return updateProfileApi('first', 'last', 'email').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Change password API', () => {
  it('API should be called on successful response', () => {
    mockPrivate
      .onPatch(CHANGE_PASSWORD_ROUTE)
      .reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'patch')
    return changePasswordApi('old', 'new', 'new').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onPatch(CHANGE_PASSWORD_ROUTE)
      .reply(400, [{ type: 'general', message: 'Password insecure' }])

    const spy = jest.spyOn(privateAPICall, 'patch')
    return changePasswordApi('old', 'new', 'new').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Forgot password API', () => {
  it('API should be called on successful response', () => {
    mockPublic
      .onGet(FORGOT_PASSWORD_ROUTE('email'))
      .reply(200, { message: 'success' })

    const spy = jest.spyOn(publicAPICall, 'get')
    return forgotPasswordApi('email').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPublic
      .onGet(FORGOT_PASSWORD_ROUTE('email'))
      .reply(400, [{ type: 'email', message: 'Email not found' }])

    const spy = jest.spyOn(publicAPICall, 'get')
    return forgotPasswordApi('email').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Verify reset token API', () => {
  it('API should be called on successful response', () => {
    mockPrivate
      .onPost(VERIFY_RESET_TOKEN_ROUTE)
      .reply(200, { message: 'success' })

    const spy = jest.spyOn(privateAPICall, 'get')
    return verifyResetTokenApi(1, 'token').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPrivate
      .onPost(VERIFY_RESET_TOKEN_ROUTE)
      .reply(400, [{ type: 'token', message: 'Token is invalid' }])

    const spy = jest.spyOn(privateAPICall, 'post')
    return verifyResetTokenApi(1, 'token').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('Reset password API', () => {
  it('API should be called on successful response', () => {
    mockPublic.onPost(RESET_PASSWORD_ROUTE).reply(200, { message: 'success' })

    const spy = jest.spyOn(publicAPICall, 'post')
    return resetPasswordApi(1, 'token', 'pass', 'pass').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('API should reject NON successful response', () => {
    mockPublic
      .onPost(RESET_PASSWORD_ROUTE)
      .reply(400, [{ type: 'token', message: 'Token is invalid' }])

    const spy = jest.spyOn(publicAPICall, 'post')
    return resetPasswordApi(1, 'token', 'pass', 'pass').catch(() => {
      expect(spy).toHaveBeenCalled()
    })
  })
})
