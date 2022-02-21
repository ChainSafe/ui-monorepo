import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Document, Page, pdfjs } from "react-pdf"
import { Button, CaretCircleLeftIcon, CaretCircleRightIcon, Typography } from "@chainsafe/common-components"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"

const useStyles = makeStyles(({ constants, zIndex }: ITheme) =>
  createStyles({
    controlsContainer: {
      position: "absolute",
      zIndex: zIndex?.layer1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      bottom: 34,
      backgroundColor: "#262626",
      color: "#D9D9D9",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#595959",
      borderRadius: 2
    },
    pageButton: {
      borderRadius: 0,
      backgroundColor: "#262626",
      border: "none"
    },
    paginationInfo: {
      paddingLeft: constants.generalUnit * 2,
      paddingRight: constants.generalUnit * 2,
      color: "#D9D9D9"
    }
  })
)

const PdfPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const classes = useStyles()
  const [pdfUrl, setPdfUrl] = useState<string | undefined>()

  useEffect(() => {
    setPdfUrl(URL.createObjectURL(contents))

    return () => {
      pdfUrl && URL.revokeObjectURL(pdfUrl)
    }
    // eslint-disable-next-line
  }, [contents])

  const [numPages, setNumPages] = useState<number | undefined>(undefined)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }

  const nextPage = () => {
    numPages && pageNumber < numPages && setPageNumber(pageNumber + 1)
  }

  const prevPage = () => {
    numPages && pageNumber > 1 && setPageNumber(pageNumber - 1)
  }

  return (
    <>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div className={classes.controlsContainer}>
        <Button
          onClick={prevPage}
          className={classes.pageButton}
        >
          <CaretCircleLeftIcon />
        </Button>
        <Typography className={classes.paginationInfo}>
          {pageNumber} of {numPages}
        </Typography>
        <Button
          onClick={nextPage}
          className={classes.pageButton}
        >
          <CaretCircleRightIcon />
        </Button>
      </div>
    </>
  )
}

export default PdfPreview
