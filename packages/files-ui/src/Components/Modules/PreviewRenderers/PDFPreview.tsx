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

// import {
//   Button,
//   ZoomInIcon,
//   ZoomOutIcon,
//   FullscreenIcon,
//   PrinterIcon,
// } from "@imploy/common-components"

const useStyles = makeStyles(({ constants, palette, zIndex }: ITheme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    controlsContainer: {
      position: "absolute",
      zIndex: zIndex?.layer1,
      display: "flex",
      flexDirection: "row",
      top: 0,
      right: 0,
      height: constants.generalUnit * 8,
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

  const { breakpoints }: ITheme = useTheme()
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }

  return (
    <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
      <Page pageNumber={pageNumber} />
    </Document>
  )
}

export default PdfPreview
