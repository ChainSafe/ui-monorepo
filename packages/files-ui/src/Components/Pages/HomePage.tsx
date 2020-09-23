import { Button } from "@chainsafe/common-components"
import { useDrive } from "@chainsafe/common-contexts"
import React, { useState } from "react"
import { useEffect } from "react"

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const HomePage = () => {
  const { list } = useDrive()
  const [folderContents, setFolderContents] = useState<any>(undefined)
  useEffect(() => {
    const getFolderContents = async () => {
      await sleep(100)
      try {
        const contents = await list({ path: "/" })
        console.log(contents)
        setFolderContents(contents)
      } catch (error) {
        console.log()
      }
    }

    getFolderContents()
  }, [])

  const handleRefreshFolder = async () => {}

  return (
    <div>
      You have logged in successfully{" "}
      <Button onClick={handleRefreshFolder}>Refresh</Button>
    </div>
  )
}

export default HomePage
