export enum PLAN_OPTION {
  Plus = "plus",
  Agile = "agile",
  Enterprise = "enterprise",
}

export interface ISubscriptionOption {
  name: PLAN_OPTION
  audience: string
  details: {
    blurb: string
    features: string[]
  }
  price: number
}

export const SubscriptionOptions: ISubscriptionOption[] = [
  {
    name: PLAN_OPTION.Plus,
    audience: "Individuals",
    details: {
      blurb: "All features from Essentials, plus:",
      features: ["80GB Storage", "Document Sign Discount", "Document Editor"],
    },
    price: 8,
  },
  {
    name: PLAN_OPTION.Agile,
    audience: "Teams",
    details: {
      blurb: "Each user has a Plus account, plus:",
      features: ["50GB Shared Drive", "Free Document Editor for all users"],
    },
    price: 10,
  },
  {
    name: PLAN_OPTION.Enterprise,
    audience: "Teams",
    details: {
      blurb: "Each user has a Plus account, plus:",
      features: ["500GB Shared Drive", "Free Document Editor for all users"],
    },
    price: 30,
  },
]
