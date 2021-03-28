import React, { useState, useEffect } from "react"
import { Grid, Button } from "@chainsafe/common-components"
import Section from "../Modules/Section"
import Title from "../Modules/Title"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ constants, palette, zIndex, breakpoints }: ITheme) => {
    return createStyles({
      wrapper: {

      },
     
     
    })
  },
)

const Landing: React.FC = () => {


  const classes = useStyles()
  return (
    <>
    <div>
      <section>
        <p>Store Files. In absolute privacy. With absolute simplicity.</p>
        <img style={{width: "60%", height: "auto"}} src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616945694/files.chainsafe.io/screenshots_ss4chz.png" alt=""/>
      </section>

    </div>
    </>
  )
}

export default Landing
