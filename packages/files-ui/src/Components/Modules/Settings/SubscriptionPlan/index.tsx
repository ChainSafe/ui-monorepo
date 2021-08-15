import React, { useState } from "react"
import CurrentProduct from "./CurrentProduct"
import AddCardModal from "./AddCardModal"
import { Button } from "@chainsafe/common-components"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    root: {
      marginBottom: constants.generalUnit * 16
    },
    container: {
      margin: constants.generalUnit * 4
    }
  })
)

const PlanView: React.FC = () => {
  const classes = useStyles()

  const [isAddCardModalOpen, setIsAddCardModalOpen ] = useState(false)
  return (
    <div className={classes.root}>
      <CurrentProduct />
      <div className={classes.container}>
        <Button onClick={() => setIsAddCardModalOpen(true)}>Add Card</Button>
      </div>
      <AddCardModal
        isModalOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
      />
    </div>
  )
}

export default PlanView
