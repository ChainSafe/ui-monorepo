import React, { useEffect, useState } from "react"
import { useField } from "formik"
import { Button, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSSTheme } from "../../Themes/types"
import clsx from "clsx"
import UploadIcon from "./Icons/UploadIcon"
import { useDropzone } from "react-dropzone"
import { t, Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ constants, palette, typography }: CSSTheme) => {
    return createStyles({
      root: {
        width: "300px"
      },
      imageContainer: {
        width: "300px",
        marginBottom: constants.generalUnit * 0.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "position": "relative"
      },
      imageInputsContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: `2px solid ${palette.additional["gray"][6]}`,
        padding: `${constants.generalUnit * 10}px 0`,
        borderStyle: "dashed",
        borderRadius: "10px",
        "& > *": {
          margin: `${constants.generalUnit}px 0`
        },
        "&.active": {
          borderColor: palette.additional["blue"][6]
        }
      },
      imageViewContainer: {
        width: "100%",
        height: "auto",
        borderRadius: "10px",
        objectFit: "cover",
        aspectRatio: "1"
      },
      inputButtons: {
        "& :hover :focus :active": {
          backgroundColor: "inherit",
          color: "inherit"
        }
      },
      browseButton: {
        backgroundColor: `${palette.additional["gray"][6]}`,
        color: `${palette.additional["gray"][10]}`,
        borderRadius: "5px",
        ...typography.body2
      },
      replaceButton: {
        backgroundColor: `${palette.additional["gray"][1]}`,
        color: `${palette.additional["gray"][7]}`,
        border: `1px solid ${palette.additional["gray"][7]}`,
        borderRadius: "5px",
        position: "absolute",
        top: constants.generalUnit * 1.5,
        right: constants.generalUnit * 1.5,
        ...typography.body2
      },
      errorMessage: {
        color: palette.error.main,
        textAlign: "center"
      }
    })
  }
)

export interface FormikImageInputProps  {
  className?: string
  name: string
}

const FormikImageInput = React.forwardRef(
  (
    {
      className,
      name,
      ...rest
    }: FormikImageInputProps,
    forwardedRef: any
  ) => {
    const classes = useStyles()
    const [{ value }, meta, helpers] = useField<File>(name)

    const [isDropActive, setIsDropActive] = useState(false)
    const [preview, setPreview] = useState<any>(undefined)

    useEffect(() => {
      value && setPreview(URL.createObjectURL(value))

      return () => {
        URL.revokeObjectURL(preview)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const { getRootProps, getInputProps, open } = useDropzone({
      onDrop: (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles.length + rejectedFiles.length > 1) {
          // multiple files uploaded
        } else if (rejectedFiles.length) {
          // there are rejected files
          // helpers.setError(rejectedFiles[0])
        } else if (acceptedFiles.length) {
          // accepted file available
          helpers.setValue(acceptedFiles[0])
        }
        setIsDropActive(false)
      },
      onDragEnter: () => {
        setIsDropActive(true)
      },
      onDragLeave: () => {
        setIsDropActive(false)
      },
      accept: "image/jpeg,image/png"
    })

    return (
      <div
        className={classes.root}
        ref={forwardedRef}>
        <div
          {...getRootProps({
            onClick: event => event.stopPropagation()
          })}
          className={clsx(
            classes.imageContainer,
            className
          )}
          {...rest}
        >
          {value ? <>
            <img
              src={preview}
              alt={t`NFT`}
              className={clsx(
                classes.imageViewContainer,
                isDropActive && "active"
              )}
            />
            <Button
              className={classes.replaceButton}
              variant="primary"
              size="small"
              onClick={open}
              type="button"
            >
              <Trans>Replace</Trans>
            </Button>
          </> : <div
            className={clsx(
              classes.imageInputsContainer,
              isDropActive && "active"
            )}
          >
            <UploadIcon />
            <Typography><Trans>Drag and drop to upload</Trans></Typography>
            <Button
              className={classes.browseButton}
              variant="primary"
              size="small"
              onClick={open}
              type="button"
            >
              <Trans>Browse files</Trans>
            </Button>
          </div>
          }

        </div>
        <input
          name={name}
          {...getInputProps()}
        />
        {
          meta.error && <Typography
            component="p"
            variant="body2"
            className={classes.errorMessage}
          >
            {meta.error}
          </Typography>
        }
      </div>
    )
  }
)

FormikImageInput.displayName = "FormikImageInput"

export default FormikImageInput
