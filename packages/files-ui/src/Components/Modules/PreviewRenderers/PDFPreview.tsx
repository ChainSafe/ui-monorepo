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

import {
  Button,
  ZoomInIcon,
  ZoomOutIcon,
  FullscreenIcon,
  PrinterIcon,
  Typography,
} from "@imploy/common-components"

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
  // const [scale, setScale] = useState(1)
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
      {desktop && (
        <div className={classes.controlsContainer}>
          <Button onClick={prevPage}>Previous</Button>
          <Typography>
            {pageNumber} of {numPages}
          </Typography>
          <Button onClick={nextPage}>Next</Button>
          {/* <Button>
                  <PrinterIcon />
                </Button> */}
        </div>
      )}
    </>
  )
}

export default PdfPreview
