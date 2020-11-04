import React from "react"
import { SelectInput, TextInput } from "@imploy/common-components"
import countryList from "./countryList"
import { makeStyles, ITheme, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      margin: `${theme.constants.generalUnit}px 0`,
    },
    textInput: {
      margin: 0,
      width: "100%",
    },
  }),
)

const CountryOrRegion: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <SelectInput
        onChange={() => {}}
        options={countryList.map((country) => ({
          label: country.label,
          value: country.label,
        }))}
        isClearable={false}
        value="Afghanistan"
        size="large"
        label="Country or region"
      />
      <TextInput
        onChange={() => {}}
        value="ok"
        className={classes.textInput}
        size="large"
      />
    </div>
  )
}

export default CountryOrRegion
