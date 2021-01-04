import React from "react"
import NavBar from "../Modules/NavBar"
import FeatureOne from "../Subpages/FeatureOne"
import Landing from "../Subpages/Landing"
import FeatureThree from "../Subpages/FeatureThree"
import WhyUseIt from "../Subpages/WhyUseIt"
import Footer from "../Modules/Footer"

const HomePage: React.FC = () => {
  return (
    <div style={{ background: "#141414" }}>
      <NavBar />
      <Landing />
      <FeatureOne />
      <FeatureThree />
      <WhyUseIt />
      <Footer />
    </div>
  )
}

export default HomePage
