import React from "react"
import FileBrowserModule from "../Modules/FileBrowserModule"

const HomePage = () => {
  return (
    <FileBrowserModule
      fileOperations={["rename", "download", "move", "delete"]}
      folderOperations={["rename", "delete"]}
    />
  )
}

export default HomePage
