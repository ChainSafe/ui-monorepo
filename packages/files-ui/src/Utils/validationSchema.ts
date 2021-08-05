import { t } from "@lingui/macro"
import { object, string } from "yup"

export const nameValidator = object().shape({
  name: string()
    .trim()
    .min(1, t`Please enter a name`)
    .max(65, t`Name too long`)
    .required("A name is required")
    .test(
      "Invalid name",
      "A name cannot contain '/' character",
      (val: string | null | undefined) => !val?.includes("/")
    )
})

export const emailValidation = object().shape({
  email: string()
    .trim()
    .email("Please enter a valid email")
    .required(t`Email is required`)
})

export const nonceValidation = object().shape({
  nonce: string()
    .trim()
    .required(t`Verification code is required`)
})