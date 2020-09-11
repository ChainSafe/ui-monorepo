import React, { useState } from "react"
import { Grid, Typography } from "@chainsafe/common-components"

const HomePage = () => {
  return (
    <div>
      <Grid container>
        <Grid item md={8}>
          <img src="abstract-image-large.png" alt="" />
          <Typography>Making secure cloud storage easier than ever.</Typography>
        </Grid>
        <Grid item md={4}>
          <Typography>Chainsafe Files</Typography>
          <Typography>Welcome user!</Typography>
          <Typography>Privacy Policy</Typography>
          <Typography>Terms and Conditions</Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default HomePage
