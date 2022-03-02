import { LookupUser } from "@chainsafe/files-api-client"
import { t } from "@lingui/macro"
import { centerEllipsis } from "./Helpers"
import { ethers } from "ethers"

export const getUserDisplayName = async (user: LookupUser) => {

  if (user.username) return user.username

  if (!user.public_address) {
    return centerEllipsis(user.uuid) || t`unknown`
  }

  try {
    // at this point the user have no username, and a public address hence maybe an ens
    const provider = new ethers.providers.InfuraProvider("mainnet")
    return await provider.lookupAddress(user.public_address)
  } catch {
    // there is no reverse lookup for this address
    return centerEllipsis(user.public_address.toLowerCase())
  }
}