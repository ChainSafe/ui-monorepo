export const decryptFile = async (
  encryptedArrayBuffer: Blob,
  password: string,
) => {
  try {
    const cipherBytes = new Uint8Array(await encryptedArrayBuffer.arrayBuffer())
    console.log(cipherBytes.length)
    const pbkdf2Iterations = 10000
    const passwordBytes = new TextEncoder().encode(password)
    const pbkdf2Salt = cipherBytes.slice(8, 16)

    const passwordKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBytes,
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    )

    const pbkdf2BytesArrayBuffer = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: pbkdf2Salt,
        iterations: pbkdf2Iterations,
        hash: "SHA-256",
      },
      passwordKey,
      384,
    )

    const pbkdf2BytesArray = new Uint8Array(pbkdf2BytesArrayBuffer)

    const keyBytes = pbkdf2BytesArray.slice(0, 32)
    const ivBytes = pbkdf2BytesArray.slice(32)

    const key = await window.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-CBC", length: 256 },
      false,
      ["decrypt"],
    )

    const plaintextBytesArrayBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: ivBytes },
      key,
      cipherBytes.slice(16),
    )
    return plaintextBytesArrayBuffer
  } catch (error) {
    console.error("Error decrypting file")
    console.error(error)
    return
  }
}
