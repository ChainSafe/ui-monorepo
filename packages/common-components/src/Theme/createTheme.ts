import {
  createTheme as genericCreateTheme,
  ICreateThemeProps,
} from "@imploy/common-themes"
import { IThemeConfig } from "@imploy/common-themes/dist/Create/CreateThemeConfig"
import { DeepPartial } from "ts-essentials/dist/types"
import { IComponentOverrides } from "./Overrides"

interface IThemeConfigWithOverrides extends Omit<IThemeConfig, "overrides"> {
  overrides: IComponentOverrides
}

interface ICreateThemePropsWithOverrides
  extends Omit<ICreateThemeProps, "themeConfig"> {
  themeConfig?: DeepPartial<IThemeConfigWithOverrides>
}

const createTheme = (props: ICreateThemePropsWithOverrides) => {
  return genericCreateTheme(props)
}

export default createTheme
