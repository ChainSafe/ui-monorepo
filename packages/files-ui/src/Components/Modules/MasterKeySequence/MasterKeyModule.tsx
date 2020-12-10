import {
  createStyles,
  ITheme,
  makeStyles,
  useOnClickOutside,
} from "@chainsafe/common-theme"
import React, { ChangeEvent, useRef } from "react"
import { SearchBar, Typography } from "@chainsafe/common-components"
import { useState } from "react"
import clsx from "clsx"
import ExplainSlide from "./SequenceSlides/Explain.slide"
import SetMasterKeySlide from "./SequenceSlides/SetMasterKey.slide"
import EnterMasterKeySlide from "./SequenceSlides/EnterMasterKey.slide"
import { useHistoryFunctions } from "@chainsafe/common-components/dist/Router/history"

const useStyles = makeStyles(({ breakpoints }: ITheme) =>
  createStyles({
    root: {
      [breakpoints.down("md")]: {},
    },
    slide: {},
  }),
)

interface IMasterKeyModule {
  className?: string
}

const MasterKeyModule: React.FC<IMasterKeyModule> = ({
  className,
}: IMasterKeyModule) => {
  const classes = useStyles()
  const [slide, setSlide] = useState<"explain" | "set">("explain")
  // TODO: WIRE POST SUBMIT
  return (
    <section className={clsx(classes.root, className)}>
      {slide === "explain" ? (
        <ExplainSlide className={classes.slide} cta={() => setSlide("set")} />
      ) : (
        <SetMasterKeySlide className={classes.slide} />
      )}
    </section>
  )
}

export default MasterKeyModule
