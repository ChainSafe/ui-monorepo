import React, { useEffect } from "react"
import { useLocation, useParams } from "@chainsafe/common-components"
import { useImployApi } from "@chainsafe/common-contexts"

function useQueryParams() {
  return new URLSearchParams(useLocation().search)
}

const OAuthCallback: React.FC = () => {
  const queryParams = useQueryParams()
  const {
    loginWithGithub,
    loginWithGoogle,
    loginWithFacebook,
    imployApiClient,
  } = useImployApi()
  const { provider } = useParams<{ provider: string }>()

  const loginOnGithub = async (code: string, state: string) => {
    try {
      await loginWithGithub(code, state)
    } catch (err) {}
  }

  const loginOnGoogle = async (
    code: string,
    state: string,
    scope: string | undefined,
    authUser: string | undefined,
    hd: string | undefined,
    prompt: string | undefined,
  ) => {
    try {
      await loginWithGoogle(code, state, scope, authUser, hd, prompt)
    } catch (err) {}
  }

  const loginOnFacebook = async (code: string, state: string) => {
    try {
      await loginWithFacebook(code, state)
    } catch (err) {}
  }

  useEffect(() => {
    const code = queryParams.get("code")
    const state = queryParams.get("state")
    if (code && state) {
      switch (provider) {
        case "github": {
          loginOnGithub(code, state)
          break
        }
        case "google": {
          const scope = queryParams.get("scope") || undefined
          const authUser = queryParams.get("authUser") || undefined
          const hd = queryParams.get("hd") || undefined
          const prompt = queryParams.get("prompt") || undefined
          if (code && state) {
            loginOnGoogle(code, state, scope, authUser, hd, prompt)
          }
          break
        }
        case "facebook": {
          loginOnFacebook(code, state)
          break
        }
        default:
      }
    }
  }, [imployApiClient])

  return <div />
}

export default OAuthCallback
