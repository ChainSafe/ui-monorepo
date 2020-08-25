import React from "react"
import Button from "../Button"
import { action } from "@storybook/addon-actions"

export default {
  title: "Button",
  component: Button,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action("onClickButton"),
}

export const PrimaryLarge = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="large">
    Primary Large
  </Button>
)

export const PrimaryLargeDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="large" disabled={true}>
    Primary Large Disabled
  </Button>
)

export const PrimaryLargeFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="large" fullsize>
    Primary Large Fullsize
  </Button>
)

export const PrimaryMedium = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="medium">
    Primary Medium
  </Button>
)

export const PrimaryMediumDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="medium" disabled={true}>
    Primary Medium Disabled
  </Button>
)

export const PrimaryMediumFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="medium" fullsize>
    Primary Medium Fullsize
  </Button>
)

export const PrimarySmall = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="small">
    Primary Small
  </Button>
)

export const PrimarySmallDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="small" disabled={true}>
    Primary Small Disabled
  </Button>
)

export const PrimarySmallFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="primary" size="small" fullsize>
    Primary Small Fullsize
  </Button>
)

export const SecondaryLarge = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="large">
    Secondary Large
  </Button>
)

export const SecondaryLargeDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="large" disabled={true}>
    Secondary Large Disabled
  </Button>
)

export const SecondaryLargeFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="large" fullsize>
    Secondary Large Fullsize
  </Button>
)

export const SecondaryMedium = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="medium">
    Secondary Medium
  </Button>
)

export const SecondaryMediumDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="medium" disabled={true}>
    Secondary Medium Disabled
  </Button>
)

export const SecondaryMediumFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="medium" fullsize>
    Secondary Medium Fullsize
  </Button>
)

export const SecondarySmall = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="small">
    Secondary Small
  </Button>
)

export const SecondarySmallDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="small" disabled={true}>
    Secondary Small Disabled
  </Button>
)

export const SecondarySmallFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="secondary" size="small" fullsize>
    Secondary Small Fullsize
  </Button>
)

export const TertiaryLarge = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="large">
    Tertiary Large
  </Button>
)

export const TertiaryLargeDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="large" disabled={true}>
    Tertiary Large Disabled
  </Button>
)

export const TertiaryLargeFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="large" fullsize>
    Tertiary Large Fullsize
  </Button>
)

export const TertiaryMedium = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="medium">
    Tertiary Medium
  </Button>
)

export const TertiaryMediumDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="medium" disabled={true}>
    Tertiary Medium Disabled
  </Button>
)

export const TertiaryMediumFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="medium" fullsize>
    Tertiary Medium Fullsize
  </Button>
)

export const TertiarySmall = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="small">
    Tertiary Small
  </Button>
)

export const TertiarySmallDisabled = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="small" disabled={true}>
    Tertiary Small Fullsize Disabled
  </Button>
)

export const TertiarySmallFullsize = (): React.ReactNode => (
  <Button {...actionsData} variant="tertiary" size="small" fullsize>
    Tertiary Small Fullsize
  </Button>
)
