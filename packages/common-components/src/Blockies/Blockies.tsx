import React from "react"
import {
  ITheme,
  makeStyles,
  createStyles,
  useTheme
} from "@chainsafe/common-theme"
import clsx from "clsx"
import Blockies from "react-blockies"

const useStyles = makeStyles(({ overrides }: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      ...overrides?.Blockies?.root
    }
  })
)

interface IBlockiesProps {
  className?: string
  seed: string
  size?: number
  scale?: number
  color?: string
  bgColor?: string
  spotColor?: string
}

const BlockiesComponent: React.FC<IBlockiesProps> = ({
  className,
  seed,
  size = 15,
  scale = 4,
  color,
  bgColor,
  spotColor
}: IBlockiesProps) => {
  const classes = useStyles()
  const theme: ITheme = useTheme()
  return (
    <Blockies
      seed={seed}
      size={size}
      scale={scale}
      color={color || theme.palette.primary.main}
      bgColor={bgColor || theme.palette.primary.background}
      spotColor={spotColor || theme.palette.secondary.main}
      className={clsx("identicon", classes.root, className)}
    />
  )
}

export default BlockiesComponent

export { IBlockiesProps }
