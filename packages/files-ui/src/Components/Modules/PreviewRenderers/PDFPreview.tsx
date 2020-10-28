import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import {
  makeStyles,
  ITheme,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@imploy/common-themes"
import { Document, Page } from "react-pdf"

import { Button, Typography } from "@imploy/common-components"

const useStyles = makeStyles(({ constants, palette, zIndex }: ITheme) =>
  createStyles({
    controlsContainer: {
      position: "absolute",
      zIndex: zIndex?.layer1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      bottom: 0,
      backgroundColor: palette.additional["gray"][9],
      color: palette.additional["gray"][3],
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: palette.additional["gray"][8],
    },
    pageButton: {
      width: 80,
    },
    paginationInfo: {
      paddingLeft: constants.generalUnit * 2,
      paddingRight: constants.generalUnit * 2,
    },
  }),
)

const PdfPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const classes = useStyles()
  const [pdfUrl, setPrdfUrl] = useState<string | undefined>()

  useEffect(() => {
    setPrdfUrl(URL.createObjectURL(contents))

    return () => {
      pdfUrl && URL.revokeObjectURL(pdfUrl)
    }
  }, [contents])

  const [numPages, setNumPages] = useState<number | undefined>(undefined)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }
  const { breakpoints }: ITheme = useTheme()

  const desktop = useMediaQuery(breakpoints.up("sm"))

  const nextPage = () => {
    numPages && pageNumber < numPages && setPageNumber(pageNumber + 1)
  }

  const prevPage = () => {
    numPages && pageNumber > 1 && setPageNumber(pageNumber - 1)
  }

  return (
    <>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <div className={classes.controlsContainer}>
        <Button onClick={prevPage} className={classes.pageButton}>
          Previous
        </Button>
        <Typography className={classes.paginationInfo}>
          {pageNumber} of {numPages}
        </Typography>
        <Button onClick={nextPage} className={classes.pageButton}>
          Next
        </Button>
      </div>
    </>
  )
}

export default PdfPreview
