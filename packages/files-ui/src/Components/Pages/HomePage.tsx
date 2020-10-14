import React from "react"
import FileBrowserModule from "../Modules/FileBrowserModule"
import UploadProgress from "../Modules/UploadProgress"

const HomePage = () => {
  return (
    <>
      <FileBrowserModule />
      <UploadProgress />
    </>
  )
}

export default HomePage
