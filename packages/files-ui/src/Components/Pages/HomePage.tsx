import React from "react"
import FileBrowserModule from "../Modules/FileBrowserModule"

const HomePage = () => {
  return (
    <FileBrowserModule
      fileOperations={["rename", "download", "delete"]}
      folderOperations={["rename", "delete"]}
    />
  )
}

export default HomePage
