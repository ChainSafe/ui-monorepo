import { IConstants } from "@chainsafe/common-theme"

export const UI_CONSTANTS = {
  mobileButtonHeight: 44,
  headerHeight: 60,
  navWidth: 8 * 27,
  contentPadding: 8 * 15,
  contentTopPadding: 8 * 15,
  mobileHeaderHeight: 8 * 6.3,
  svgWidth: 8 * 2.5,
  topPadding: 8 * 3,
  mobileNavWidth: 8 * 30,
  headerTopPadding: 8 * 3,
  accountControlsPadding: 8 * 7
}

export interface CsfColors extends IConstants {
  landing: {
    logoText: string
  }
  header: {
    rootBackground: string
    optionsBackground: string
    optionsTextColor: string
    optionsBorder: string
    menuItemTextColor: string
    iconColor: string
    hamburger: string
  }
  modalDefault: {
    fadeBackground: string
    background: string
  }
  nav: {
    backgroundColor: string
    blocker: string
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
  }
  previewModal: {
    controlsBackground: string
    controlsColor: string
    closeButtonColor: string
    fileOpsColor: string
    fileNameColor: string
    optionsBackground: string
    optionsTextColor: string
    optionsBorder: string
    menuItemIconColor: string
    menuItemTextColor: string
    message: string
    previewTopNavHeight: number
    previewBottomNavHeight: number
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
    icon: string
    iconHover: string
    addMore: string
    addMoreBackground: string
    footerBackground: string
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
  masterKey: {
    desktop: {
      color: string
      link: string
      checkbox: string
    }
    mobile: {
      color: string
      link: string
      checkbox: string
    }
  }
  profile: {
    icon: string
  }
  uploadAlert: {
    icon: string
  }
}