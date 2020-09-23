import { Button } from "@chainsafe/common-components"
import { useDrive } from "@chainsafe/common-contexts"
import React, { useState } from "react"
import { useEffect } from "react"

const HomePage = () => {
  const { list } = useDrive()
  useEffect(() => {
    const getFolderContents = async () => {
      try {
        const contents = await list({ path: "/" })
        console.log(contents)
      } catch (error) {
        console.log(error)
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
