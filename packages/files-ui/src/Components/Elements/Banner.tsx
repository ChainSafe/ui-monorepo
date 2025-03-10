import React from "react"
import { Box, Typography } from "@material-ui/core"

const Banner = () => {
  return (
    <Box
      width="100%"
      padding={2}
      bgcolor="#ffc4c4"
      border={1}
      borderColor="grey.300"
      boxShadow={1}
      textAlign="center"
      margin={0}
    >
      <Typography variant="body1" >
        {/* eslint-disable-next-line max-len */}
        To our valued customers, ChainSafe Storage will be sunset on April 1st, 2025. User uploads will be suspended prior to that date on March 20th, 2025. Please retrieve all of your files on the platform before April 1st to avoid loosing access. If you are using Storage as a back end, please switch over to another storage service. Feel free to send an email to support@files.chainsafe.io if you have any questions or concerns.
      </Typography>
    </Box>
  )
}

export default Banner