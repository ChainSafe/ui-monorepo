import { useCallback, useEffect, useState } from "react"

const useSessionStorage = () => {
  const [canUseSessionStorage, setCanUseSessionStorage] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem("test", "test")
      sessionStorage.removeItem("test")
      setCanUseSessionStorage(true)
    } catch (e) {
      console.error("Unable to use sessionStorage")
    }
  }, [])

  const sessionStorageGet = useCallback((key: string) => {
    if(!canUseSessionStorage) {
      throw new Error("Unable to use sessionStorage")
    }

    return sessionStorage.getItem(key)
  }, [canUseSessionStorage])

  const sessionStorageSet = useCallback((key: string, value: string) => {
    if(!canUseSessionStorage) {
      throw new Error("Unable to use sessionStorage")
    }

    sessionStorage.setItem(key, value)
  }, [canUseSessionStorage])

  const sessionStorageRemove = useCallback((key: string) => {
    if(!canUseSessionStorage) {
      throw new Error("Unable to use sessionStorage")
    }

    sessionStorage.removeItem(key)
  }, [canUseSessionStorage])

  return { canUseSessionStorage, sessionStorageRemove, sessionStorageGet, sessionStorageSet }
}

export default useSessionStorage