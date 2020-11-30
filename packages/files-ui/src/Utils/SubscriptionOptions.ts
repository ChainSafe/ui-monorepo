import { PricingInfo } from "@imploy/api-client"

export enum PLAN_COLOR_SCHEME {
  Gray = "gray",
  Blue = "blue",
  Black = "black",
}

export interface ISubscriptionOption {
  yearlyPlanId: string
  colorScheme: PLAN_COLOR_SCHEME
  productName: string
  title: string
  audience: string
  blurb: string
  features: string[]
  price: number
}

// export const PricingInfoToISubscriptionOption = (input: PricingInfo): ISubscriptionOption => ({
//   audience: input
// })

export const SubscriptionOptions: ISubscriptionOption[] = [
  {
    productName: "plus",
    colorScheme: PLAN_COLOR_SCHEME.Gray,
    title: "Plus",
    yearlyPlanId: "123123",
    audience: "Individuals",
    blurb: "All features from Essentials, plus:",
    features: ["80GB Storage", "Document Sign Discount", "Document Editor"],
    price: 8,
  },
  {
    productName: "agile",
    colorScheme: PLAN_COLOR_SCHEME.Blue,
    title: "Agile",
    yearlyPlanId: "12322123",
    audience: "Teams",
    blurb: "Each user has a Plus account, plus:",
    features: ["50GB Shared Drive", "Free Document Editor for all users"],
    price: 10,
  },
  {
    productName: "enterprise",
    colorScheme: PLAN_COLOR_SCHEME.Gray,
    title: "Enterprise",
    yearlyPlanId: "1212312323123",
    audience: "Teams",
    blurb: "Each user has a Plus account, plus:",
    features: ["500GB Shared Drive", "Free Document Editor for all users"],
    price: 30,
  },
]
