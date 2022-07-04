import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Typography,
  Button
} from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, palette }: CSSTheme) =>
  createStyles({
    root: {
      maxWidth: "100%"
    },
    imageBox: {
      width: "100%",
      objectFit: "cover",
      marginBottom: constants.generalUnit
    },
    nameTitle: {
      marginBottom: constants.generalUnit * 0.5
    },
    nameContainer: {
      borderBottom: `1px solid ${palette.additional["gray"][6]}`,
      marginBottom: constants.generalUnit * 0.5
    },
    cidRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "&.clickable": {
        cursor: "pointer"
      }
    },
    cidStartSection: {
      display: "flex",
      alignItems: "center"
    },
    subtitle: {
      color: palette.additional["gray"][7]
    },
    cid: {
      maxWidth: 150,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    copyButton: {
      color: palette.primary.main,
      padding: `${constants.generalUnit * 0.5}px 0 !important`
    },
    copiedText: {
      padding: `${constants.generalUnit * 0.5}px 0 !important`
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
  const [isCopied, setIsCopied] = useState(false)

  return (
    <div className={classes.root}>
      <img
        src={imageURI}
        alt={name}
        className={classes.imageBox}
      />
      <div className={classes.nameContainer}>
        <Typography
          variant="h5"
          component="p"
          className={classes.nameTitle}
        >
          {name}
        </Typography>
      </div>
      <div
        className={clsx(classes.cidRow, !isCopied && "clickable")}
        onClick={() => {
          navigator.clipboard.writeText(CID)
          setIsCopied(true)
          setInterval(() => setIsCopied(false), 3000)
        }}
      >
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
        {isCopied
          ? <Typography
            className={classes.copiedText}
            variant="body1"
          >
            Copied
          </Typography>
          : <Button
            className={classes.copyButton}
            variant="text"
          >
            <Trans>Copy</Trans>
          </Button>
        }
      </div>
    </div>
  )
}

export default NFTItem