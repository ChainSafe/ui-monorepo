import React, { useState } from "react"
import CurrentProduct from "./CurrentProduct"
import CurrentCard from "./CurrentCard"
import AddCardModal from "./AddCardModal"
import { Button } from "@chainsafe/common-components"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    root: {
      marginBottom: constants.generalUnit * 16
    },
    container: {
      margin: `0 ${constants.generalUnit * 4}px`
    }
  })
)

const PlanView: React.FC = () => {
  const classes = useStyles()
  const [isAddCardModalOpen, setIsAddCardModalOpen ] = useState(false)

  return (
    <div className={classes.root}>
      <CurrentProduct />
      <CurrentCard />
      <div className={classes.container}>
        <Button onClick={() => setIsAddCardModalOpen(true)}>
          <Trans>Update Card</Trans>
        </Button>
      </div>
      <AddCardModal
        isModalOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
      />
    </div>
  )
}

export default PlanView
