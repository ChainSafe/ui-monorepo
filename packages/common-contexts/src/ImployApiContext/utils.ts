import { ethers, providers } from "ethers"

export const signMessage = async (
  message: string,
  provider: providers.Web3Provider
) => {
  const data = ethers.utils.toUtf8Bytes(message)
  const signer = await provider.getSigner()
  const addr = await signer.getAddress()
  const sig = await provider.send("personal_sign", [
    ethers.utils.hexlify(data),
    addr.toLowerCase()
  ])
  return sig
}
