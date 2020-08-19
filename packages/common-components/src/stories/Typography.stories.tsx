import React from "react"
import Typography from "../Typography"
import { action } from "@storybook/addon-actions"

export default {
  title: "Typography",
  component: Typography,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action("onClickTypography"),
}

export const Default = (): React.ReactNode => (
  <Typography {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const h1 = (): React.ReactNode => (
  <Typography variant="h1" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const h2 = (): React.ReactNode => (
  <Typography variant="h2" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const h3 = (): React.ReactNode => (
  <Typography variant="h3" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const h4 = (): React.ReactNode => (
  <Typography variant="h4" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const h5 = (): React.ReactNode => (
  <Typography variant="h5" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const h6 = (): React.ReactNode => (
  <Typography variant="h6" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const subtitle1 = (): React.ReactNode => (
  <Typography variant="subtitle2" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const subtitle2 = (): React.ReactNode => (
  <Typography variant="subtitle2" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const body1 = (): React.ReactNode => (
  <Typography variant="body1" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const body2 = (): React.ReactNode => (
  <Typography variant="body2" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const caption = (): React.ReactNode => (
  <Typography variant="caption" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)

export const button = (): React.ReactNode => (
  <Typography variant="button" {...actionsData}>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quia
    suscipit autem molestiae officia nesciunt, mollitia quod nobis cum
    blanditiis harum impedit deserunt sequi officiis incidunt rem. Ab, non
    assumenda.
  </Typography>
)
