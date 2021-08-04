import { LookupUser } from "@chainsafe/files-api-client"
import { t } from "@lingui/macro"
import { centerEllipsis } from "./Helpers"

export const getUserDisplayName = (user: LookupUser) =>
  user.username || centerEllipsis(user.public_address.toLowerCase(), 6) || user.uuid || t`unknown`