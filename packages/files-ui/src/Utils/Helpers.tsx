import { useLocation } from "@chainsafe/common-components"

export const centerEllipsis = (address: string, remaining: number = 6) => {
  if (address.length <= remaining * 2) {
    return address
  }
  return `${address.substr(0, remaining)}...${address.substr(
    address.length - remaining,
    remaining,
  )}`
}

export const testLocalStorage = () => {
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
    return true
  } catch (e) {
    return false
  }
}

export const readFileAsync = (file: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = () => {
      reader.result && resolve(reader.result as ArrayBuffer)
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file)
  })
}

export function useQuery() {
  return new URLSearchParams(useLocation().search)
}
