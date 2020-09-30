import React from "react"
import FileBrowserModule from "../Modules/FileBrowserModule"

const HomePage = () => {
  return (
    <FileBrowserModule
      fileRequest={{
        path: "/",
      }}
    />
  )
}

export default HomePage
