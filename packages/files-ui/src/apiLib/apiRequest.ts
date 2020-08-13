import axios from 'axios'
import config from '../config/config'
import {
  getAccessTokenLocal,
  getRefreshTokenLocal,
  setTokensLocal,
  removeUserAndTokenLocal
} from '../util/localstorage'
import { REFRESH_ROUTE } from './apiRoutes'

const defaultOptions = {
  baseURL: config.API,
  headers: {
    'Content-Type': 'application/json'
  }
}

const publicInstance = axios.create(defaultOptions)
const privateInstance = axios.create(defaultOptions)

privateInstance.interceptors.request.use(configIns => {
  const token = getAccessTokenLocal()

  configIns.headers.Authorization = token ? `Bearer ${token}` : ''
  return configIns
})

privateInstance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (!error.config._retry && error.response.status === 401) {
      error.config._retry = true
      const refreshToken = getRefreshTokenLocal()
      if (refreshToken) {
        try {
          const res = await publicAPICall.get(REFRESH_ROUTE(refreshToken))
          setTokensLocal(
            res.data.access_token.token,
            res.data.refresh_token.token
          )
          error.response.config.headers.Authorization = `Bearer ${res.data.access_token.token}`
          return axios(error.response.config)
        } catch (err) {
          removeUserAndTokenLocal()
          return Promise.reject(error)
        }
      } else {
        removeUserAndTokenLocal()
        return Promise.reject(error)
      }
    }
    // return Error object with Promise
    return Promise.reject(error)
  }
)

export const privateAPICall = privateInstance
export const publicAPICall = publicInstance
