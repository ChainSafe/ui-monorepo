import jwtDecode from 'jwt-decode'

export function getDecodedAccessToken(token: string): any {
  try {
    return jwtDecode(token)
  } catch (err) {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  const decodedToken = getDecodedAccessToken(token)
  if (!decodedToken) {
    // token could not be decoded
    return false
  } else {
    if (Date.now() < decodedToken.exp * 1000 || !decodedToken.exp) {
      // has expired
      return true
    } else {
      return false
    }
  }
}
