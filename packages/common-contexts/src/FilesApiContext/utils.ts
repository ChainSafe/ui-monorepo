import { Signer } from "ethers"

export const signMessage = async (message: string, signer: Signer) => {
  const sig = await signer.signMessage(message)
  return sig
}
