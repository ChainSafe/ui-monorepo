import { t } from "@lingui/macro"
import { object, string } from "yup"
import CID, { isCID  } from "cids"

export const renameSchema = object().shape({
  fileName: string()
    .trim()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .test(
      t`Invalid name`,
      t`Name cannot contain '/' character`,
      (val: string | null | undefined) => !!val && !val?.includes("/")
    )
    .required(t`A name is required`)
})

export const folderNameValidator = object().shape({
  name: string()
    .trim()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required("Folder name is required")
    .test(
      "Invalid name",
      "Folder name cannot contain '/' character",
      (val: string | null | undefined) => !val?.includes("/")
    )
})

export const bucketNameValidator = object().shape({
  name: string()
    .trim()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required(t`Bucket name is required`)
    .test(
      "Invalid name",
      t`Bucket name cannot contain '/' character`,
      (val: string | null | undefined) => !val?.includes("/")
    )
})

export const cidValidator = object().shape({
  cid: string()
    .required(t`CID is required`)
    .test(
      "IsValidCID",
      t`CID invalid`,
      value => {
        try {
          return isCID(new CID(`${value}`))
        }
        catch (error) {
          console.error(error)
          return false
        }
      }
    )
})