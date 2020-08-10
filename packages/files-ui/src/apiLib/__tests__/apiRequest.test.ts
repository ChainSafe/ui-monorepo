import { privateAPICall, publicAPICall } from '../apiRequest'
import {
  getAccessTokenLocal,
  getRefreshTokenLocal
} from 'src/util/localstorage'
import axios, {
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { REFRESH_ROUTE } from '../apiRoutes'
import { mocked } from 'ts-jest/utils'

const mockAxios = new MockAdapter(axios)
// const mockAxiosPrivate = new MockAdapter(privateAPICall);
const mockAxiosPublic = new MockAdapter(publicAPICall)

// const getRefreshTokenLocalMock = jest.fn(getRefreshTokenLocal);

// const jestMockAxios = jest.mock("axios");

jest.mock('../../util/localstorage', () => ({
  getAccessTokenLocal: jest.fn(),
  getRefreshTokenLocal: jest.fn(),
  setTokensLocal: jest.fn(),
  removeUserAndTokenLocal: jest.fn()
}))

const getAccessTokenLocalMocked = mocked(getAccessTokenLocal)
const getRefreshTokenLocalMocked = mocked(getRefreshTokenLocal)

interface IInterceptorRequest
  extends AxiosInterceptorManager<AxiosRequestConfig> {
  handlers: any
}

interface IInterceptorResponse
  extends AxiosInterceptorManager<AxiosResponse<any>> {
  handlers: any
}

describe('API request', () => {
  describe('request interceptor', () => {
    const requestInterceptor = privateAPICall.interceptors
      .request as IInterceptorRequest

    it('request should add authorization token to header', () => {
      getAccessTokenLocalMocked.mockReturnValueOnce('token')
      const result = requestInterceptor.handlers[0].fulfilled({ headers: {} })

      expect(result.headers).toHaveProperty('Authorization')
      expect(result.headers.Authorization).toBe('Bearer token')
    })

    it('request should add authorization token to header', () => {
      getAccessTokenLocalMocked.mockReturnValueOnce(null)
      const result = requestInterceptor.handlers[0].fulfilled({ headers: {} })

      expect(result.headers).toHaveProperty('Authorization')
      expect(result.headers.Authorization).toBe('')
    })
  })

  describe('response interceptor', () => {
    const responseInterceptor = privateAPICall.interceptors
      .response as IInterceptorResponse

    it('should return 200 on correct response', () => {
      const response = {
        response: { status: 200 },
        config: {}
      }

      const responseInter = responseInterceptor.handlers[0].fulfilled(response)
      expect(responseInter.response.status).toBe(200)
    })
    it('should create API error on not 401 requests', () => {
      const response = {
        response: { status: 500 },
        config: {}
      }

      return responseInterceptor.handlers[0]
        .rejected(response)
        .catch((err: any) => {
          expect(err.response.status).toBe(500)
        })
    })

    it('should create API error on not 401 requests', () => {
      const response = {
        response: { status: 500 },
        config: {}
      }

      return responseInterceptor.handlers[0]
        .rejected(response)
        .catch((err: any) => {
          expect(err.response.status).toBe(500)
        })
    })

    it('should retry refresh route on 401 and get 200 on valid refresh try', () => {
      const response = {
        response: {
          status: 401,
          config: {
            headers: {},
            url: 'random',
            method: 'get'
          }
        },
        config: {}
      }

      getRefreshTokenLocalMocked.mockReturnValueOnce('token')

      mockAxiosPublic.onGet(REFRESH_ROUTE('token')).reply(200, {
        access_token: { token: 'newToken' },
        refresh_token: { token: 'refreshToken' }
      })

      mockAxios.onGet('random').reply(200)

      return responseInterceptor.handlers[0]
        .rejected(response)
        .then((res: any) => {
          expect(res.status).toBe(200)
        })
    })

    it('should retry refresh route on 401 and reject if NO REFRESH TOKEN', () => {
      const response = {
        response: {
          status: 401,
          config: {
            headers: {},
            url: 'random',
            method: 'get'
          }
        },
        config: {}
      }

      getRefreshTokenLocalMocked.mockReturnValueOnce(null)

      return responseInterceptor.handlers[0]
        .rejected(response)
        .catch((err: any) => {
          expect(err.response.status).toBe(401)
        })
    })

    it('should retry refresh route on 401 and reject if REFRESH FAILS', () => {
      const response = {
        response: {
          status: 401,
          config: {
            headers: {},
            url: 'random',
            method: 'get'
          }
        },
        config: {}
      }

      getRefreshTokenLocalMocked.mockReturnValueOnce('token')

      mockAxiosPublic.onGet(REFRESH_ROUTE('token')).reply(401)

      return responseInterceptor.handlers[0]
        .rejected(response)
        .catch((err: any) => {
          expect(err.response.status).toBe(401)
        })
    })
  })
})
