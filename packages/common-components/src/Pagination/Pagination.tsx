import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { ArrowLeftIcon, ArrowRightIcon, Typography } from "@chainsafe/common-components"
import clsx from "clsx"
import { ITheme } from "@chainsafe/common-theme"
import { Button } from "../Button"

const useStyles = makeStyles(({ constants, palette }: ITheme) => {
  return createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      margin: `${constants.generalUnit}px 0`
    },
    icons: {
      fill: palette.text.primary,
      fontSize: 12,
      cursor: "pointer",
      padding: constants.generalUnit,
      color: palette.additional["gray"][9]
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
  pageNo?: number
  totalPages?: number
  onNextClick?: () => void
  onPreviousClick?: () => void
  loadingNext?: boolean
  loadingPrevious?: boolean
  showPageNumbers?: boolean
  isNextDisabled?: boolean
  isPreviousDisabled?: boolean
}

const Pagination: React.FC<IPaginationProps> = ({
  pageNo,
  totalPages,
  onNextClick,
  onPreviousClick,
  loadingNext,
  loadingPrevious,
  showPageNumbers,
  isNextDisabled,
  isPreviousDisabled
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button
        variant="outline"
        loading={loadingPrevious}
        onClick={onPreviousClick}
        disabled={isPreviousDisabled || !!pageNo && pageNo <= 1}
      >
        <ArrowLeftIcon className={clsx(classes.icons, classes.leftIcon)} />
      </Button>
      {!!showPageNumbers && pageNo && totalPages &&
        <Typography
          component="p"
          variant="body1"
        >
          Page {pageNo} of {totalPages}
        </Typography>
      }
      <Button
        variant="outline"
        loading={loadingNext}
        disabled={isNextDisabled || pageNo === totalPages}
        onClick={onNextClick}
      >
        <ArrowRightIcon className={clsx(classes.icons, classes.rightIcon)} />
      </Button>
    </div>
  )
}

export default Pagination