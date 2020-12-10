export const encryptFile = async (
  fileArrayBuffer: ArrayBuffer,
  password: string,
) => {
  try {
    const plainTextBytes = new Uint8Array(fileArrayBuffer)

    const pbkdf2Iterations = 10000
    const passwordBytes = new TextEncoder().encode(password)
    const pbkdf2Salt = window.crypto.getRandomValues(new Uint8Array(8))

    const passwordKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBytes,
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    )

    const secretKey = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: pbkdf2Salt,
        iterations: pbkdf2Iterations,
        hash: "SHA-256",
      },
      passwordKey,
      384,
    )

    const pbkdf2Bytes = new Uint8Array(secretKey)

    const keyBytes = pbkdf2Bytes.slice(0, 32)
    const ivBytes = pbkdf2Bytes.slice(32)

    const key = await window.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt"],
    )

    const cipherBytes = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: ivBytes },
      key,
      plainTextBytes,
    )
    const cipherBytesArray = new Uint8Array(cipherBytes)
    const resultbytes = new Uint8Array(cipherBytesArray.length + 16)
    resultbytes.set(new TextEncoder().encode("Salted__"))
    resultbytes.set(pbkdf2Salt, 8)
    resultbytes.set(cipherBytesArray, 16)

    return resultbytes
  } catch (error) {
    console.error("Error encrypting file")
    console.error(error)
    throw error
  }
}
