import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Typography,
  Button
} from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import axios from "axios"
import { trimChar } from "../../../Utils/pathUtils"
import { IPFS_GATEWAY } from "../../../Utils/Constants"

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
      display: "table",
      tableLayout: "fixed",
      width: "100%",
      whiteSpace: "nowrap"
    },
    cidSubtitle: {
      width: "35px",
      display: "table-cell",
      color: palette.additional["gray"][7]
    },
    cid: {
      display: "table-cell",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    copyButton: {
      marginLeft: constants.generalUnit,
      color: palette.primary.main,
      padding: `${constants.generalUnit * 0.5}px 0 !important`
    },
    copiedText: {
      marginLeft: constants.generalUnit,
      padding: `${constants.generalUnit * 0.5}px 0 !important`
    }
  })
)

interface NFTData {
  name: string
  CID: string
  image?: string
}

const NFTItem = ({ CID }: {CID: string}) => {
  const classes = useStyles()
  const [isCopied, setIsCopied] = useState(false)
  const [NFTData, setNFTData] = useState<NFTData>()

  useEffect(() => {
    axios.get(`${trimChar(IPFS_GATEWAY, "/")}/${CID}`)
      .then(({ data }) => { setNFTData({
        CID,
        name: data.name,
        image: data.image?.replace("ipfs://", `${trimChar(IPFS_GATEWAY, "/")}/`)
      }) })
      .catch(console.error)
  }, [CID])

  if (!NFTData) return null

  return (
    <div className={classes.root}>
      <img
        src={NFTData.image}
        alt={NFTData.name}
        className={classes.imageBox}
      />
      <div className={classes.nameContainer}>
        <Typography
          variant="h5"
          component="p"
          className={classes.nameTitle}
        >
          {NFTData.name}
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
            className={classes.cidSubtitle}
          >
            <Trans>CID</Trans> :&nbsp;
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
            <Trans>Copied!</Trans>
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
