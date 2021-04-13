import { useCallback, useEffect, useState } from "react"

const useLocalStorage = () => {
  const [canUseLocalStorage, setCanUseLocalStorage] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      setCanUseLocalStorage(true)
    } catch (e) {
      console.error("Unable to use localStorage")
    }
  }, [])

  const localStorageGet = useCallback((key: string) => {
    if(!canUseLocalStorage) {
      throw new Error("Unable to use localStorage")
    }

    return localStorage.getItem(key)
  }, [canUseLocalStorage])

  const localStorageSet = useCallback((key: string, value: string) => {
    if(!canUseLocalStorage) {
      throw new Error("Unable to use localStorage")
    }

    sessionStorage.setItem(key, value)
  }, [canUseLocalStorage])

  const localStorageRemove = useCallback((key: string) => {
    if(!canUseLocalStorage) {
      throw new Error("Unable to use localStorage")
    }

    sessionStorage.removeItem(key)
  }, [canUseLocalStorage])

  return { canUseLocalStorage, localStorageRemove, localStorageGet, localStorageSet }
}

export default useLocalStorage