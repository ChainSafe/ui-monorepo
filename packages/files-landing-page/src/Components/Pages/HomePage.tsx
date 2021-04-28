import React from "react"
import NavBar from "../Modules/NavBar"
import Landing from "../Subpages/Landing"
import Footer from "../Modules/Footer"

const HomePage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Landing />
      <Footer />
    </div>
  )
}

export default HomePage
