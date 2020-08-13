import { IWeb3AuthRequest } from './constants'
import { IUser } from 'src/types'
import { postWeb3LoginApi, getProfileApi } from 'src/apiLib/userApi'
import { setTokensLocal, setUserLocal } from 'src/util/localstorage'

export const web3AuthExec = async ({
  address,
  token,
  signature
}: IWeb3AuthRequest): Promise<IUser> => {
  const { access_token, refresh_token } = await postWeb3LoginApi(
    address,
    token,
    signature
  )
  setTokensLocal(access_token.token, refresh_token.token)

  const rawUserdata = await getProfileApi()
  const userProfile: IUser = {
    id: rawUserdata.id,
    firstName: rawUserdata.first_name,
    lastName: rawUserdata.last_name,
    email: rawUserdata.email,
    verified: rawUserdata.verified,
    billing: rawUserdata.payment_active,
    address: rawUserdata.public_address,
    emailChanged: rawUserdata.last_email_change,
    joinedDate: rawUserdata.created_at
  }
  setUserLocal(userProfile)
  return userProfile
}
