import { useLayoutEffect, useState } from "react"
import { AnchorPosition } from "./MenuDropdown"
import useDimensions from "./useDimensions";

interface UseDynamicPositioningArg {
  liveMeasure?: boolean
  defaultAnchor?: AnchorPosition
}

export type UseDynamicPositioningHook = [
  (node: HTMLElement) => void,
  AnchorPosition
];


function useDynamicPositioning({
  liveMeasure = false,
  defaultAnchor = "top-right"
}: UseDynamicPositioningArg): UseDynamicPositioningHook  {
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
        // Pass node height to memo 

        
        // if default top, check next siblings
        // if default bottom, check previous siblings

        // Pass siblings to memo function 

        debugger
      }
    },[node])    

    return [ref, recommended];
}

export default useDynamicPositioning;