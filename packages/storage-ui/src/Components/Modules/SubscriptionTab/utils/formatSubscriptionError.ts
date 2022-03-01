import { t } from "@lingui/macro"

export const formatSubscriptionError = (e: any): string =>
  e.error.code === 400 && e.error.message.includes("declined")
    ? t`The transaction was declined. Please use a different card or try again.`
    : t`Failed to update the subscription. Please try again later.`