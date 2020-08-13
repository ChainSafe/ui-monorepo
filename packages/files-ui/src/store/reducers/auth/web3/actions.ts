import { IWeb3AuthAction, WEB3_SIGNIN, IWeb3AuthRequest } from './constants'
import { web3AuthExec } from './executions'
import {
  showErrorToastAction,
  IToastErrorAction
} from '../../toast/actionCreators'
import { removeUserAndTokenLocal } from 'src/util/localstorage'

export const authenticateWeb3AuthAction = async (
  request: IWeb3AuthRequest
): Promise<IWeb3AuthAction | IToastErrorAction> => {
  // Execute
  try {
    const userDoc = await web3AuthExec(request)
    return {
      type: WEB3_SIGNIN,
      payload: userDoc
    }
  } catch (error) {
    removeUserAndTokenLocal()
    return showErrorToastAction({
      message: 'Web3AuthError',
      description: 'The server returned an error when validating the sign in'
    })
  }
}
