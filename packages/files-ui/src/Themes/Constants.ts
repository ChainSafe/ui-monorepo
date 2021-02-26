import { IConstants } from "@chainsafe/common-theme";

export const UI_CONSTANTS = {
  mobileButtonHeight: 44,
  headerHeight: 60,
  navWidth: 8 * 27, // constants.generalUnit
  contentPadding: 8 * 15, // constants.generalUnit
  contentTopPadding: 8 * 15, // constants.generalUnit
  mobileHeaderHeight: 8 * 6.3, // constants.generalUnit
  svgWidth: 8 * 2.5, // constants.generalUnit
  topPadding: 8 * 3, // constants.generalUnit
  mobileNavWidth: 8 * 30, // constants.generalUnit
  headerTopPadding: 8 * 3, // constants.generalUnit
  accountControlsPadding: 8 * 7, // constants.generalUnit
}

export interface UI_COLORS extends Partial<IConstants> {
  header: {
    rootBackground: string
    optionsBackground: string
    optionsTextColor: string
    optionsBorder: string
    menuItemTextColor: string
    iconColor: string
  }
  modalDefault: {
    fadebackground: string
    background: string
  }
  nav: {
    backgroundColor: string
    mobileBackgroundColor: string
    headingColor: string
    itemColor: string
    itemColorHover: string
    itemIconColor: string
    itemIconColorHover: string
  }
  createFolder: {
    backgroundColor: string
    color: string
  },
  previewModal: {
    controlsBackground: string
    controlsColor: string
    closeButtonColor: string
    fileOpsColor: string
    fileNameColor: string,
    optionsBackground: string
    optionsTextColor: string
    optionsBorder: string
    menuItemIconColor: string
    menuItemTextColor: string
  }
  searchModule: {
    resultsBackground: string
    resultsBackdrop: string
    resultsHeading: string
    resultsFolder: string
    resultsRow: string
    noResults: string
  }
  uploadModal: {
    background: string
    color: string
  }
  fileInfoModal: {
    background: string
    color: string
    copyButtonBackground: string
    copyButtonColor: string
    infoContainerBorderTop: string
  }
  moveFileModal: {
    background: string
    color: string
  }
  filesTable: {
    color: string
  }
  fileSystemItemRow: {
    icon: string
    menuIcon: string
    dropdownIcon: string
    optionsBackground: string
    optionsColor: string
    optionsBorder: string
    itemBackground: string
    itemColor: string
  }
  masterkey: {
    color: string
    link: string
  }
  profile: {
    icon: string
  }
  uploadAlert:{
    icon: string
  }
}