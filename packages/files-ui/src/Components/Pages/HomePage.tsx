import React from "react"
import FileBrowserModule from "../Modules/FileBrowserModule"

const HomePage = () => {
  return (
    <FileBrowserModule
      fileOperations={["move", "info", "rename", "delete", "download"]}
      folderOperations={["rename", "delete"]}
    />
  )
}

export default HomePage
