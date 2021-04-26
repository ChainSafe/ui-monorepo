import React, { useMemo } from "react"
import { useLanguageContext } from "../../../Contexts/LanguageContext"
import { MenuDropdown } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(
  ({ constants, palette }: CSFTheme) => {
    return createStyles({
      root: {
        border: `1px solid ${palette.additional["gray"][6]}`,
        minWidth: 145,
        backgroundColor: palette.additional["gray"][1]
      },
      options: {
        backgroundColor: constants.header.optionsBackground,
        color: constants.header.optionsTextColor,
        border: `1px solid ${constants.header.optionsBorder}`
      },
      icon: {
        position: "absolute",
        right: constants.generalUnit * 2,
        "& svg": {
          fill: constants.header.iconColor
        }
      }
    })
  }
)

const LanguageSelection = () => {
  const classes = useStyles()
  const { availableLanguages, selectedLanguage, setActiveLanguage } = useLanguageContext()
  const currentLanguage = useMemo(
    () => availableLanguages.find((land) => land.id === selectedLanguage)?.label
    , [availableLanguages, selectedLanguage]
  )

  return (
    <MenuDropdown
      animation="none"
      anchor="top-right"
      className={classes.root}
      classNames={{
        icon: classes.icon,
        options: classes.options
      }}
      menuItems={availableLanguages.map((lang) => (
        {
          contents: (
            <span>
              {lang.label}
            </span>
          ),
          onClick: () => setActiveLanguage(lang.id)
        }
      ))}
      title={currentLanguage}
    />
  )
}

export default LanguageSelection