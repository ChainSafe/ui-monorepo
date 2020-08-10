import { IUser } from 'src/types'

export const WEB3_SIGNIN = '@@files/auth/WEB3_SIGNIN'

export interface IWeb3AuthRequest {
  address: string
  token: string
  signature: string
}

export interface IWeb3AuthAction {
  type: typeof WEB3_SIGNIN
  payload: IUser
}
