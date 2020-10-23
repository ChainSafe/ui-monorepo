import { hotjar } from "react-hotjar"

export const initHotjar = (hotjarId: number) => {
  hotjar.initialize(hotjarId, 6)
}
