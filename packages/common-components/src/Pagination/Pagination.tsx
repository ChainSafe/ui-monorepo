import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { ArrowLeftIcon, ArrowRightIcon, Typography } from "@chainsafe/common-components"
import clsx from "clsx"
import { ITheme } from "@chainsafe/common-theme"

const useStyles = makeStyles(({ constants, palette }: ITheme) => {
  return createStyles({
    root: {
      display: "flex",
      color: palette.text.primary,
      alignItems: "center",
      margin: `${constants.generalUnit}px 0`
    },
    icons: {
      fill: palette.text.primary,
      fontSize: 12,
      cursor: "pointer",
      padding: constants.generalUnit
    },
    leftIcon: {
      marginRight: constants.generalUnit
    },
    rightIcon: {
      marginLeft: constants.generalUnit
    }
  })
})

export interface IPaginationProps {
  pageNo: number
  totalPages: number
  onNextClick?: () => void
  onPreviousClick?: () => void
}

const Pagination: React.FC<IPaginationProps> = ({
  pageNo,
  totalPages,
  onNextClick,
  onPreviousClick
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ArrowLeftIcon
        onClick={onPreviousClick}
        disabled={pageNo <= 1}
        className={clsx(classes.icons, classes.leftIcon)}
      />
      <Typography component="p"
        variant="body1">
        Page {pageNo} of {totalPages}
      </Typography>
      <ArrowRightIcon
        onClick={onNextClick}
        disabled={pageNo === totalPages}
        className={clsx(classes.icons, classes.rightIcon)}
      />
    </div>
  )
}

export default Pagination