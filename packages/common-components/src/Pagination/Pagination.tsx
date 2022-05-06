import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CaretLeftIcon, CaretRightIcon } from "../Icons"
import { ITheme } from "@chainsafe/common-theme"
import { Button } from "../Button"
import { Typography } from "../Typography"

const useStyles = makeStyles(({ constants, palette }: ITheme) => {
  return createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      margin: `${constants.generalUnit}px 0`
    },
    nextButton: {
      marginLeft: constants.generalUnit * 1.5
    },
    previousButton: {
      marginRight: constants.generalUnit * 1.5
    },
    icons: {
      fill: palette.additional["gray"][9]
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
        size="medium"
        disabled={isPreviousDisabled || (showPageNumbers && !!pageNo && pageNo <= 1)}
        className={classes.previousButton}
      >
        <CaretLeftIcon className={classes.icons} />
      </Button>
      {!!showPageNumbers && pageNo &&
        <Typography
          component="p"
          variant="body1"
        >
          {`Page ${pageNo} ${totalPages ? `of ${totalPages}` : "" }`}
        </Typography>
      }
      <Button
        variant="outline"
        loading={loadingNext}
        size="medium"
        disabled={isNextDisabled || (showPageNumbers && pageNo === totalPages)}
        onClick={onNextClick}
        className={classes.nextButton}
      >
        <CaretRightIcon className={classes.icons} />
      </Button>
    </div>
  )
}

export default Pagination