import React, { useState } from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { ProgressBar, Typography } from "@imploy/common-components"

const useStyles = makeStyles(
  ({ constants, palette, zIndex, breakpoints }: ITheme) => {
    const WIDTH = 400
    return createStyles({
      boxContainer: {
        backgroundColor: palette.additional["gray"][3],
        margin: `${constants.generalUnit}px 0`,
        border: `1px solid ${palette.additional["gray"][6]}`,
        padding: constants.generalUnit,
      },
    })
  },
)

interface IUploadBox {
  fileName: string
  progress: number
  error?: boolean
  complete: boolean
  noOfFiles: number
  index: number
  remove(index: number): void
}

const UploadBox: React.FC<IUploadBox> = (props) => {
  const {
    fileName,
    progress,
    error,
    complete,
    noOfFiles,
    index,
    remove,
  } = props
  const classes = useStyles()

  return (
    <div className={classes.boxContainer}>
      {complete ? (
        <div>
          {fileName} {noOfFiles}
        </div>
      ) : error ? (
        <div>error</div>
      ) : (
        <div>
          <ProgressBar progress={progress} size="small" />
        </div>
      )}
      <button onClick={() => remove(index)}>remove</button>
    </div>
  )
}

export default UploadBox
