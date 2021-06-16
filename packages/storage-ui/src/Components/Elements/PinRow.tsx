import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { formatBytes, TableCell, TableRow  } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { PinStatus } from "@chainsafe/files-api-client"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
    }
  })
)
interface Props {
    pinStatus: PinStatus
}

const IPFS_GATEWAY = "https://ipfs.infura.io:5001/api/v0/cat/"

const PinRow = ({ pinStatus }: Props) => {
  const classes = useStyles()

  return (
    <TableRow
      type="grid"
      className={classes.root}
    >
      <TableCell>
        {pinStatus.pin?.cid}
      </TableCell>
      <TableCell>
        {dayjs(pinStatus.created).format("DD MMM YYYY h:mm a")}
      </TableCell>
      <TableCell>
        {formatBytes(pinStatus.info?.size)}
      </TableCell>
      <TableCell>
        <a
          href={`${IPFS_GATEWAY}${pinStatus.pin?.cid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Open on Gateway</Trans>
        </a>
      </TableCell>
      <TableCell>

      </TableCell>
    </TableRow>
  )
}

export default PinRow