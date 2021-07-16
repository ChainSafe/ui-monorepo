import { t } from "@lingui/macro"
import { object, string } from "yup"

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