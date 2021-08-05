import { t } from "@lingui/macro"
import { object, string } from "yup"
import { cid as isCid } from "is-ipfs"

export const nameValidator = object().shape({
  name: string()
    .trim()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required("A name is required")
    .test(
      "Invalid name",
      "The name cannot contain '/' character",
      (val: string | null | undefined) => !val?.includes("/")
    )
})

export const bucketNameValidator = (bucketNames: Array<string | undefined>) => object().shape({
  name: string()
    .trim()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required(t`Bucket name is required`)
    .test(
      "Invalid name",
      t`The name cannot contain '/' character`,
      (val: string | null | undefined) => !val?.includes("/")
    )
    .test(
      "Unique name",
      t`A bucket with this name already exists`,
      (val: string | null | undefined) => !!val && !bucketNames.includes(val)
    )
})

export const cidValidator = object().shape({
  cid: string()
    .trim()
    .required(t`CID is required`)
    .test(
      "Valid CID",
      t`CID invalid`,
      value => isCid(value)
    )
})