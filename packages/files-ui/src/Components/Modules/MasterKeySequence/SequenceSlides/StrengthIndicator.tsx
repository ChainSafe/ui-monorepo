import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React, { useEffect, useState } from "react"
import clsx from "clsx"
import { Typography } from "@chainsafe/common-components"
import { useField } from "formik"
import zxcvbn from "zxcvbn"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    root: {},
    indicatorRoot: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",

      "& > *": {
        display: "block",
        height: constants.generalUnit,
        width: `calc(25% - ${constants.generalUnit}px)`,
        margin: `${constants.generalUnit}px 0`,
        "&:nth-child(1)": {
          backgroundColor: palette.error.main,
        },
        "&:nth-child(2)": {
          backgroundColor: palette.warning.main,
        },
        "&:nth-child(3)": {
          backgroundColor: palette.success.border,
        },
        "&:nth-child(4)": {
          backgroundColor: palette.success.main,
        },
        "&.inactive": {
          backgroundColor: palette.additional["gray"][7],
        },
      },
    },
    caption: {
      marginTop: constants.generalUnit,
    },
  }),
)

interface IStrengthIndicator {
  className?: string
  fieldName: string
}

const StrengthIndicator: React.FC<IStrengthIndicator> = ({
  className,
  fieldName,
}: IStrengthIndicator) => {
  const classes = useStyles()

  const [field] = useField(fieldName)
  const [score, setScore] = useState<number>(0)
  const [message, setMessage] = useState<string | undefined>()

  useEffect(() => {
    if (field.value) {
      const temp = zxcvbn(field.value)
      setScore(temp.score)
      if (temp.feedback.warning && temp.feedback.warning !== "") {
        setMessage(temp.feedback.warning)
      } else if (temp.feedback.suggestions.length > 0) {
        setMessage(temp.feedback.suggestions.join(" "))
      } else {
        setMessage(undefined)
      }
    } else {
      setScore(0)
      setMessage(undefined)
    }
  }, [field])

  return (
    <section className={clsx(classes.root, className)}>
      <div className={classes.indicatorRoot}>
        <div
          className={clsx({
            inactive: score < 1,
          })}
        ></div>
        <div
          className={clsx({
            inactive: score < 2,
          })}
        ></div>
        <div
          className={clsx({
            inactive: score < 3,
          })}
        ></div>
        <div
          className={clsx({
            inactive: score < 4,
          })}
        ></div>
      </div>
      <Typography className={classes.caption}>{message}</Typography>
    </section>
  )
}

export default StrengthIndicator
