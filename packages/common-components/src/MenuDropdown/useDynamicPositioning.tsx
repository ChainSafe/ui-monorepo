import { useLayoutEffect, useState } from "react"
import { AnchorPosition } from "./MenuDropdown"
import useDimensions from "./useDimensions";

interface UseDynamicPositioningArg {
  liveMeasure: boolean
  defaultAnchor?: AnchorPosition
}

function useDynamicPositioning({
  liveMeasure = false,
  defaultAnchor = "top-right"
}: UseDynamicPositioningArg = {
  liveMeasure: false,
  defaultAnchor: "top-right"
})  {
    const [ref, dimensions, node] = useDimensions({
      liveMeasure
    });
    const [recommended, setRecommended] = useState<AnchorPosition>(defaultAnchor)
    // const [horizontal, setHorisontal] = useState<"left" | "right" | "center">("left")
    // const [vertical, setVertical] = useState<"top" | "bottom">("top")

    // Get dimensions
    // Get dementions of bottom | top 
    useLayoutEffect(() => {
      if (node) {
        console.log(dimensions?.bottom)
        setRecommended(defaultAnchor)
        debugger
      }
    },[node])    

    return [ref, recommended];
}

export default useDynamicPositioning;