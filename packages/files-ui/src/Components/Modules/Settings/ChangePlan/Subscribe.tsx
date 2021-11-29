import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Product } from "@chainsafe/files-api-client"
import { Breadcrumb } from "@chainsafe/common-components"

const useStyles = makeStyles(({ constants }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
    }

  })
)

interface IPlanDetails {
  plan: Product
}

const PlanDetails = ({ plan }: IPlanDetails) => {
  const classes = useStyles()

  return (
    <article className={classes.root}>
      <Breadcrumb
        crumbs={[{
          text: "Change plan"
        }, {
          text: "Subscribe"
        }]}
        hideHome={true}
      />
      {plan.name}
    </article>
  )
}

export default PlanDetails