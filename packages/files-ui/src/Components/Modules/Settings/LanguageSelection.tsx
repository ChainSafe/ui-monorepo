import React, { useMemo } from "react"
import { useLanguageContext } from "../../../Contexts/LanguageContext"
import { MenuDropdown } from "@chainsafe/common-components"

const LanguageSelection = () => {
  const { availableLanguages, selectedLanguage, setActiveLanguage } = useLanguageContext()
  const currentLanguage = useMemo(
    () => availableLanguages.find((land) => land.id === selectedLanguage)?.label
    , [availableLanguages, selectedLanguage]
  )

  console.log("availableLanguages", availableLanguages)
  console.log("selectedLanguage", selectedLanguage)
  return (
    <div>
      <MenuDropdown
        animation="none"
        anchor="top-right"
        className={"bla"}
        classNames={{}}
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
    </div>
  )
}

export default LanguageSelection