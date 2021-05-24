import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Document, Page, pdfjs } from "react-pdf"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"

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
      borderColor: palette.additional["gray"][8]
    },
    pageButton: {
      width: 80
    },
    paginationInfo: {
      paddingLeft: constants.generalUnit * 2,
      paddingRight: constants.generalUnit * 2
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
          <Trans>Previous</Trans>
        </Button>
        <Typography className={classes.paginationInfo}>
          {pageNumber} of {numPages}
        </Typography>
        <Button
          onClick={nextPage}
          className={classes.pageButton}
        >
          <Trans>Next</Trans>
        </Button>
      </div>
    </>
  )
}

export default PdfPreview
