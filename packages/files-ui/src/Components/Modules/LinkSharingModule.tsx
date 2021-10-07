import React, { useEffect, useMemo, useState } from "react"
import { useLocation } from "@chainsafe/common-components"
import { getBucketDecryptionFromHash, getJWT } from "../../Utils/pathUtils"
import { useFilesApi } from "../../Contexts/FilesApiContext"
import { useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import { Trans } from "@lingui/macro"
import { useFiles } from "../../Contexts/FilesContext"
import jwtDecode from "jwt-decode"

const LinkSharingModule = () => {
  const { pathname, hash } = useLocation()
  const jwt = useMemo(() => getJWT(pathname), [pathname])
  const bucketDecryptionKey = useMemo(() => getBucketDecryptionFromHash(hash), [hash])
  const { filesApiClient } = useFilesApi()
  const { refreshBuckets } = useFiles()
  const { publicKey, encryptForPublicKey } = useThresholdKey()
  const [encryptedEncryptionKey, setEncryptedEncryptionKey] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const bucketId = useMemo(() => jwt && jwtDecode<{bucket_id?: string}>(jwt)?.bucket_id, [jwt])

  useEffect(() => {
    if(!publicKey || !bucketDecryptionKey) return

    encryptForPublicKey(publicKey, bucketDecryptionKey)
      .then(setEncryptedEncryptionKey)
      .catch(console.error)

  }, [bucketDecryptionKey, encryptForPublicKey, publicKey])

  useEffect(() => {
    if(!jwt || !encryptedEncryptionKey) return

    filesApiClient.verifyNonce({ jwt, encryption_key: encryptedEncryptionKey })
      .then((value) => console.log("value", value))
      .catch((e:any) => {
        console.error(error)
        setError(e.message)
      })
      .finally(() => {
        setIsLoading(false)
        refreshBuckets()
      })
  }, [encryptedEncryptionKey, error, filesApiClient, jwt, refreshBuckets])

  return (
    <>
      {isLoading && (
        <div>
          <Trans>Adding you to the shared folder...</Trans>
        </div>
      )}
      {!isLoading && !error && (
        <div>
          Got added to {bucketId}
        </div>
      )}
      {!!error && (
        <div>
          {error}
        </div>
      )}
    </>
  )
}

export default LinkSharingModule
