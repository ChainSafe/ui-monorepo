import { t } from "@lingui/macro"
import { object, string } from "yup"
import { cid as isCid } from "is-ipfs"

const whitespaceOnlyRegex = new RegExp("^\\s+$")

export const renameSchema = object().shape({
  fileName: string()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .test(
      "Invalid character in name",
      t`Name cannot contain '/' character`,
      (val: string | null | undefined) => !val?.includes("/")
    )
    .test(
      "Only whitespace",
      t`Name cannot only contain whitepsace characters`,
      (val) => !!val && !whitespaceOnlyRegex.test(val)
    )
    .required(t`A name is required`)
})

export const folderNameValidator = object().shape({
  name: string()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required("Folder name is required")
    .test(
      "Invalid name",
      "Folder name cannot contain '/' character",
      (val: string | null | undefined) => !val?.includes("/")
    )
    .test(
      "Only whitespace",
      t`Folder name cannot only contain whitepsace characters`,
      (val) => !!val && !whitespaceOnlyRegex.test(val)
    )
})

export const bucketNameValidator = (bucketNames: Array<string | undefined>) => object().shape({
  name: string()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required(t`Bucket name is required`)
    .test(
      "Invalid name",
      t`Bucket name cannot contain '/' character`,
      (val: string | null | undefined) => !val?.includes("/")
    )
    .test(
      "Only whitespace",
      t`Bucket name cannot only contain whitepsace characters`,
      (val) => !!val && !whitespaceOnlyRegex.test(val)
    )
    .test(
      "Unique name",
      t`A bucket with this name already exists`,
      (val: string | null | undefined) => !!val && !bucketNames.includes(val)
    )
})

export const cidValidator = object().shape({
  cid: string()
    .required(t`CID is required`)
    .test(
      "Valid CID",
      t`CID invalid`,
      value => isCid(value)
    )
})