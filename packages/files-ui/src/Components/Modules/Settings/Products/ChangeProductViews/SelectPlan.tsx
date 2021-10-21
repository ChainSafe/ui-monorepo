import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { CSFTheme } from "../../../../../Themes/types"

const useStyles = makeStyles(({ constants, palette, typography }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 3}px 0px`
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      "& > *": {
        marginLeft: constants.generalUnit
      }
    },
    bottomSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }
  })
)

interface ISelectPlan {
  className?: string
  close: () => void
  next: (id: string) => void
}

const SelectPlan = ({ close, className, next }: ISelectPlan) => {
  const classes = useStyles()

  const [newPlan, setNewPlan] = useState<string | undefined>(undefined)

  return (
    <article className={clsx(classes.root, className)}>
      <Typography
        component="p"
        variant="h4"
      >
        <Trans>
          Switch Plans
        </Trans>
      </Typography>
      <section>

      </section>
      <section className={classes.bottomSection}>
        <a
          href="#"
          target="_blank"
        >
          <Trans>
            Not sure what to pick? Learn more about our plans
          </Trans>
        </a>
        <div className={classes.buttons}>
          <Button
            onClick={() => close()}
            variant="secondary"
          >
            <Trans>
              Cancel
            </Trans>
          </Button>
          <Button
            disabled={!newPlan}
            onClick={() => next(newPlan as string)}
            variant="primary"
          >
            <Trans>
              Select this plan
            </Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default SelectPlan