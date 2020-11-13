import React, { useEffect } from "react"
import { useLocation, useParams } from "@imploy/common-components"
import { useImployApi } from "@imploy/common-contexts"

function useQueryParams() {
  return new URLSearchParams(useLocation().search)
}

const OAuthCallback: React.FC = () => {
  const queryParams = useQueryParams()
  const { loginWithGithub, loginWithGoogle, loginWithFacebook } = useImployApi()
  const { provider } = useParams<{ provider: string }>()

  useEffect(() => {
    const loginWithProvider = async () => {
      try {
        const code = queryParams.get("code")
        const state = queryParams.get("state")
        if (code && state) {
          switch (provider) {
            case "github": {
              await loginWithGithub(code, state)
              break
            }
            case "google": {
              const scope = queryParams.get("scope") || undefined
              const authUser = queryParams.get("authUser") || undefined
              const hd = queryParams.get("hd") || undefined
              const prompt = queryParams.get("prompt") || undefined

              await loginWithGoogle(code, state, scope, authUser, hd, prompt)
              break
            }
            case "facebook": {
              await loginWithFacebook(code, state)
              break
            }
            default:
          }
        }
      } catch {}
    }

    loginWithProvider()
    // eslint-disable-next-line
  }, [provider, queryParams])

  return null
}

export default OAuthCallback
