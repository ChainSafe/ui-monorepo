import { FileInput, Typography } from "@imploy/common-components"
import { useDrive } from "../../Contexts/DriveContext"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import React, { useEffect } from "react"
import { Formik, Form, useFormikContext } from "formik"
import { array, object } from "yup"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ animation, constants, palette, zIndex }: ITheme) =>
    createStyles({
      root: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        opacity: 0,
        visibility: "hidden",
        transitionDuration: `${animation.transform}ms`,
        "&.active": {
          opacity: 1,
          visibility: "visible",
        },
      },
      input: {
        marginBottom: constants.generalUnit * 2,
        height: "100%",
        width: "100%",
        backgroundColor: "unset",
      },
      cta: {
        fontSize: 56,
        lineHeight: "64px",
        fontWeight: 600,
      },
      label: {
        height: "100%",
        backgroundColor: "unset !important",
        position: "relative",
        "&:before": {
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.9,
          backgroundColor: palette.additional["gray"][4],
          content: "''",
          display: "block",
          height: "100%",
          width: "100%",
          zIndex: zIndex?.background,
        },
      },
    }),
)

interface IDragDropModuleProps {
  className?: string
  active: boolean
  close: () => void
}

interface IAutoSubmit {
  active: boolean
}

const AutoSubmit: React.FC<IAutoSubmit> = ({ active }: IAutoSubmit) => {
  const { values, submitForm, touched, isValid, dirty } = useFormikContext()

  useEffect(() => {
    if (touched && isValid && dirty && active && values) {
      submitForm()
    }
  }, [submitForm, touched, isValid, dirty, active, values])
  return <></>
}

const DragDropModule: React.FC<IDragDropModuleProps> = ({
  active,
  className,
  close,
}: IDragDropModuleProps) => {
  const classes = useStyles()
  const { uploadFiles, currentPath } = useDrive()

  const UploadSchema = object().shape({
    files: array()
      .min(1, "Please select a file")
      .required("Please select a file to upload"),
  })

  return (
    <Formik
      initialValues={{
        files: [],
      }}
      validationSchema={UploadSchema}
      onSubmit={async (values, helpers) => {
        helpers.setSubmitting(true)
        try {
          uploadFiles(values.files, currentPath)
          helpers.resetForm()
          close()
        } catch (errors) {
          if (errors[0].message.includes("conflict with existing")) {
            helpers.setFieldError("files", "File/Folder exists")
          } else {
            helpers.setFieldError("files", errors[0].message)
          }
        }
        helpers.setSubmitting(false)
      }}
    >
      <Form
        className={clsx(classes.root, className, {
          active: active,
        })}
      >
        <AutoSubmit active={active} />
        <FileInput
          multiple={true}
          className={classes.input}
          classNames={{
            pending: classes.label,
          }}
          pending={
            <Typography className={classes.cta}>
              Drop to upload files
            </Typography>
          }
          label="Upload Files and Folders"
          name="files"
        />
      </Form>
    </Formik>
  )
}

export default DragDropModule
