import { t } from "@lingui/macro"
import { object, string } from "yup"

// eslint-disable-next-line 
const spacesOnlyRegex = new RegExp(`^\s+$`)

export const renameSchema = object().shape({
  fileName: string()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required(t`A name is required`)
    .test(
      "Invalid character in name",
      t`Name cannot contain '/' character`,
      (val: string | null | undefined) => !val?.includes("/")
    )
    .test(
      "Only whitespace",
      t`Name cannot only contain whitepsace characters`,
      (val) => !!val && !spacesOnlyRegex.test(val)
    )
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
      (val) => !!val && !spacesOnlyRegex.test(val)
    )
})