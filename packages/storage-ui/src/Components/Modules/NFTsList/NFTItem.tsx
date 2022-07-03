import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Typography,
  Button,
  Divider
} from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants, palette }: CSSTheme) =>
  createStyles({
    root: {
      position: "relative"
    },
    imageBox: {
      width: "inherit",
      height: "100%",
      objectFit: "cover",
      marginBottom: constants.generalUnit * 2
    },
    cidRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    cidStartSection: {
      display: "flex",
      alignItems: "center"
    },
    subtitle: {
      color: palette.additional["gray"][7]
    },
    cid: {
      maxWidth: 200,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    copyButton: {
      color: palette.primary.main,
      padding: `${constants.generalUnit}px 0`
    }
  })
)

interface Props {
  imageURI: string
  name: string
  CID: string
}

const NFTItem = ({ imageURI, name, CID }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div>
        <img
          src={imageURI}
          alt={name}
          className={classes.imageBox}
        />
      </div>
      <div>
        <div>
          <Typography
            variant="h5"
            component="p">
            {name}
          </Typography>
        </div>
        <Divider />
        <div className={classes.cidRow}>
          <div className={classes.cidStartSection}>
            <Typography
              variant="body1"
              component="p"
              className={classes.subtitle}
            >
              CID:&nbsp;
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.cid}
            >
              {CID}
            </Typography>
          </div>
          <Button
            className={classes.copyButton}
            variant="text"
          >
            <Trans>Copy</Trans>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NFTItem
