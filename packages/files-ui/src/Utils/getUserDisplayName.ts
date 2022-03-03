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
    const lookupName = await provider.lookupAddress(user.public_address)
    const lookupAddress = await provider.resolveName(lookupName)

    // double check that the lookup name actually resolves to the same address
    return user.public_address === lookupAddress
      ? lookupName
      : centerEllipsis(user.public_address.toLowerCase())
  } catch {
    // there is no reverse lookup for this address
    return centerEllipsis(user.public_address.toLowerCase())
  }
}