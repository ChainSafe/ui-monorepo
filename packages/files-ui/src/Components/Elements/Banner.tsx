import React from 'react';
import { Box, Typography } from "@material-ui/core";

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
        To our valued customers, ChainSafe Files will be sunset on March 10th, 2025. Please retrieve all of your files on the platform before this date to avoid loosing access. Feel free to send an email to support@files.chainsafe.io if you have any questions or concerns.
      </Typography>
    </Box>
  );
};

export default Banner;