import { IAvatarOverride } from "./Avatar"
import { IBlockiesOverride } from "./Blockies"
import { IBreadcrumbOverride } from "./Breadcrumb"
import { IButtonOverride } from "./Button"
import { ICardOverride } from "./Card"
import { IChainsafeLogoOverride } from "./ChainsafeLogo"
import { ICheckboxOverride } from "./Checkbox"
import { IDividerOverride } from "./Divider"
import { IDrawerOverride } from "./Drawer"
import { IExpansionPanelOverride } from "./ExpansionPanel"
import { IFileInputOverride } from "./FileInput"
import { IGridOverride } from "./Grid"
import { IIconOverride } from "./Icon"
import { IMenuDropdownOverride } from "./MenuDropdown"
import { IModalOverride } from "./Modal"
import { IPaperOverride } from "./Paper"
import { IRadioInputOverride } from "./RadioInput"
import { IScrollbarWrapperOverride } from "./ScrollbarWrapper"
import { ISearchBarOverride } from "./SearchBar"
import { ISelectInputOverride } from "./SelectInput"
import { ITableOverride } from "./Table"
import { ITabsOverride } from "./Tabs"
import { ITextInputOverride } from "./TextInput"
import { IToasterOverride } from "./Toaster"
import { ITypographyOverride } from "./Typography"

export interface IComponentOverrides {
  Avatar?: IAvatarOverride;
  Blockies?: IBlockiesOverride;
  Breadcrumb?: IBreadcrumbOverride;
  Button?: IButtonOverride;
  Card?: ICardOverride;
  ChainsafeLogo?: IChainsafeLogoOverride;
  CheckboxInput?: ICheckboxOverride;
  Divider?: IDividerOverride;
  Drawer?: IDrawerOverride;
  ExpansionPanel?: IExpansionPanelOverride;
  FileInput?: IFileInputOverride;
  Grid?: IGridOverride;
  Icons?: IIconOverride;
  MenuDropdown?: IMenuDropdownOverride;
  Modal?: IModalOverride;
  Paper?: IPaperOverride;
  RadioInput?: IRadioInputOverride;
  ScrollbarWrapper?: IScrollbarWrapperOverride;
  SearchBar?: ISearchBarOverride;
  SelectInput?: ISelectInputOverride;
  Table?: ITableOverride;
  Tabs?: ITabsOverride;
  TextInput?: ITextInputOverride;
  Toaster?: IToasterOverride;
  Typography?: ITypographyOverride;
}
