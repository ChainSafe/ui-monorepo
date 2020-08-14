/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-empty-interface */
// import original module declarations
import 'styled-components'
import { Theme } from '@chainsafe/common-ui'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends any {}
}
