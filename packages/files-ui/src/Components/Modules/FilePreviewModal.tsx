import React from "react"
import { useState } from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { Formik, Form } from "formik"
import clsx from "clsx"
import { Modal } from "@imploy/common-components"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    root: {},
  }),
)

const FilePreviewModal: React.FC<{}> = ({}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => setOpen(false)

  return (
    <>
      <Modal active={open} closePosition="none" maxWidth="sm">
        File Preview modal goes here
      </Modal>
    </>
  )
}

export default FilePreviewModal
