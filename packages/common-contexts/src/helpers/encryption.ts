import pbkdf2 from "pbkdf2"
import tweetnacl from "tweetnacl"

const iterations = 10000

const generateKey = (
  password: string,
  salt: Uint8Array,
  iterations: number,
) => {
  return new Promise<Buffer>((resolve, reject) => {
    pbkdf2.pbkdf2(password, salt, iterations, 32, "sha256", (err, key) => {
      if (err) reject(err)
      resolve(key)
    })
  })
}

export const encryptFile = async (
  fileArrayBuffer: ArrayBuffer,
  password: string,
) => {
  try {
    const plainTextBytes = new Uint8Array(fileArrayBuffer)
    const salt = window.crypto.getRandomValues(new Uint8Array(24))
    const derivedKey = await generateKey(password, salt, iterations)
    const cipher = tweetnacl.secretbox(plainTextBytes, salt, derivedKey)
    const resultbytes = new Uint8Array(cipher.length + 32)
    resultbytes.set(new TextEncoder().encode("CSFFiles"))
    resultbytes.set(salt, 8)
    resultbytes.set(cipher, 32)

    return resultbytes
  } catch (error) {
    console.error("Error encrypting file")
    console.error(error)
    throw error
  }
}

export const decryptFile = async (
  cipher: ArrayBuffer | Uint8Array,
  password: string,
) => {
  try {
    const cipherBytes = new Uint8Array(cipher)
    const salt = cipherBytes.slice(8, 32)
    const derivedKey = await generateKey(password, salt, iterations)
    const decrypted = await tweetnacl.secretbox.open(
      cipherBytes.slice(32),
      salt,
      derivedKey,
    )
    return decrypted
  } catch (error) {
    return
  }
}
