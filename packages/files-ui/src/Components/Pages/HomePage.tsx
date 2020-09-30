import { Button } from "@chainsafe/common-components"
import { useDrive } from "@chainsafe/common-contexts"
import React from "react"
import { useEffect } from "react"
import CreateFolderModule from "../Modules/CreateFolderModule"

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
  }, [list])

  const getFolderContents = async () => {
    try {
      const contents = await list({ path: "/" })
      console.log(contents)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      You have logged in successfully{" "}
      <Button onClick={getFolderContents}>Get Files</Button>
      <CreateFolderModule />
    </div>
  )
}

export default HomePage
