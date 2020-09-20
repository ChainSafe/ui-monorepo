import React from "react"
import { NavLink } from "@chainsafe/common-components"

const HomePage = () => {
  return (
    <div>
      You have logged in successfully<NavLink to="/settings">settings</NavLink>
    </div>
  )
}

export default HomePage
