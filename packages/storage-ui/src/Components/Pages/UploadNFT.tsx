import React, { ReactNode, useState } from "react"
import { Button, Divider, FileInput, FormikTextInput, SelectInput, TextInput, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles, useThemeSwitcher, ITheme } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"
import { usePageTrack } from "../../Contexts/PosthogContext"
import { Helmet } from "react-helmet-async"
import { FieldArray, Form, FormikProvider, useFormik, useFormikContext } from "formik"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import FormikImageInput from "../Elements/FormikImageInput"

const useStyles = makeStyles(({ constants, breakpoints }: ITheme) =>
  createStyles({
    container: {
      marginTop: constants.generalUnit * 2
    },
    headerContainer: {
      marginBottom: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        padding: `0 ${constants.generalUnit * 2}px`,
        marginTop: constants.generalUnit * 4,
        marginBottom: constants.generalUnit * 2
      }
    },
    title: {
      marginTop: constants.generalUnit,
      [breakpoints.down("md")]: {
        fontSize: 20,
        lineHeight: "28px",
        margin: `${constants.generalUnit}px 0`
      }
    }
  })
)

const primitives = ["boolean", "string", "number"]

const ObjectInput: React.FC<{ obj: any; namespace: string }> =
  ({ obj, namespace }) => {
    const [newFieldName, setNewFieldName] = useState("")
    const [newFieldType, setNewFieldType] = useState<"value" | "array" | "file" | "object">("value")
    const formikBag = useFormikContext()

    return <>
      <div style={{ border: "1px #000 solid" }}>
        <Typography>{namespace}</Typography><br />
        {Object.keys(obj).map((key) => generateFormFields(obj[key], `${namespace}.${key}`))}
        <TextInput
          value={newFieldName}
          onChange={(val) => setNewFieldName(val?.toString() || "")}
          label={t`Property name`}
        />
        <SelectInput
          options={[{
            label: "Value", // Use better description here
            value: "value"
          }, {
            label: "Object", // Use better description here
            value: "object"
          }, {
            label: "Array",
            value: "array"
          }, {
            label: "File",
            value: "file"
          }]}
          onChange={setNewFieldType}
          value={newFieldType}
          label="Property type"
        />
        <Button
          type="button"
          onClick={() => formikBag.setFieldValue(`${namespace}.${newFieldName}`, (newFieldType === "array")
            ? []
            : (newFieldType === "file")
              ? null
              : (newFieldType === "object")
                ? {}
                : "")
          }>Add property</Button>
      </div>
    </>
  }

const ArrayInput: React.FC<{ obj: Array<any>; namespace: string }> =
  ({ obj, namespace }) => {
    const [newFieldType, setNewFieldType] = useState<"value" | "array" | "file" | "object">("value")

    return <FieldArray
      name={`${namespace}`}>
      {({ push }) => {
        return <div style={{ border: "1px #000 solid" }}>
          <Typography>{namespace}</Typography>
          {obj.map((item: any, index: number) => generateFormFields(item, `${namespace}[${index}]`))}
          <SelectInput
            options={[{
              label: "Value", // Use better description here
              value: "value"
            }, {
              label: "Object", // Use better description here
              value: "object"
            }, {
              label: "Array",
              value: "array"
            }, {
              label: "File",
              value: "file"
            }]}
            onChange={setNewFieldType}
            value={newFieldType}
            label="Item type" />
          <Button
            type="button"
            onClick={() => {
              (newFieldType === "array")
                ? push([])
                : (newFieldType === "file")
                  ? push(null)
                  : (newFieldType === "object")
                    ? push({})
                    : push("")
            }}>Add item</Button>
        </div>
      }}
    </FieldArray>
  }

const generateFormFields = (val: any, namespace?: string): ReactNode | (ReactNode | undefined)[] => {
  if (!!namespace && primitives.includes(typeof val)) {
    return <FormikTextInput
      name={namespace}
      label={namespace}
      key={namespace} />
  }

  // This is a file
  if (!!namespace && (val === null || (typeof val === "object" && (val instanceof File || val instanceof Blob)))) {
    return <FileInput
      name={namespace}
      label={namespace}
      onFileNumberChange={() => undefined}
      moreFilesLabel={""}
      maxFiles={1}
      key={namespace} />
  }

  // This is an Array
  if (typeof val === "object" && Array.isArray(val)) {
    return <ArrayInput
      obj={val}
      namespace={namespace || ""}
      key={namespace} />
  }

  // This is an object but not an array
  if (typeof val === "object") {
    return <ObjectInput
      obj={val}
      namespace={`${namespace}`}
      key={namespace} />
  }
  return undefined
}



const CreateNFTPage: React.FC = () => {
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  usePageTrack()

  const initialValues: { [key: string]: any } = {
    image: null,
    name: "",
    decimals: "",
    description: "",
    properties: {}
  }

  const { storageApiClient } = useStorageApi()

  const formikProps = useFormik({
    initialValues: initialValues,
    // validationSchema={validationSchema}
    onSubmit: async (val) => {
      console.log("submitting")
      console.log(val)
      const result = await storageApiClient.uploadNFT(val)
      console.log(result)
    },
    enableReinitialize: true
  })

  return (
    <div className={classes.container}>
      <Helmet>
        <title>{t`Upload NFT`} - Chainsafe Storage</title>
      </Helmet>
      <div className={classes.headerContainer}>
        <Typography
          variant="h1"
          component="p"
          className={classes.title}
        >
          <Trans>Upload NFT</Trans>
        </Typography>
      </div>
      {desktop && <Divider />}
      <FormikProvider value={formikProps}>
        <Form>
          <FormikTextInput name='name' />
          <FormikTextInput name='description' />
          <FormikTextInput name='decimals' />
          <FormikImageInput name='image' />
          {generateFormFields(formikProps.values.properties, "properties")}
          <Button type="submit"><Trans>Upload</Trans></Button>
        </Form>
      </FormikProvider>
    </div>
  )
}

export default CreateNFTPage
