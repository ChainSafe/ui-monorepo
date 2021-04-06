import { useWeb3 } from "@chainsafe/web3-context"
import { t } from "@lingui/macro"
import { useEffect, useState } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { centerEllipsis } from "../../../Utils/Helpers"

const useLoggedInAs = () => {
  const { userInfo } = useThresholdKey()
  const { address } = useWeb3()

  const [loggedinAs, setLoggedinAs] = useState("")

  useEffect(() => {
    if (userInfo?.userInfo.typeOfLogin) {
      switch (userInfo.userInfo.typeOfLogin) {
      case "jwt":
        setLoggedinAs(t`Logged in with Web3` + ` ${centerEllipsis(String(address), 4)}`)
        break
      case "facebook":
        setLoggedinAs(t`Logged in with Facebook` + ` ${centerEllipsis(userInfo.userInfo.email, 4)}`)
        break
      case "github":
        setLoggedinAs(t`Logged in with Github` + ` ${centerEllipsis(userInfo.userInfo.email, 4)}`)
        break
      case "google":
        setLoggedinAs(t`Logged in with Google` + ` ${centerEllipsis(userInfo.userInfo.email, 4)}`)
        break
      default:
        setLoggedinAs(`${centerEllipsis(userInfo.publicAddress, 4)}`)
        break
      }
    }
  }, [userInfo, address])

  return { loggedinAs }
}

export default useLoggedInAs