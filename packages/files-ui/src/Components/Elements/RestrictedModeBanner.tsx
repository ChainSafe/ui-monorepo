import {Typography,Button, useHistory} from '@chainsafe/common-components'
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import {Trans} from '@lingui/macro'
import React from 'react'
import {CSFTheme} from '../../Themes/types'
import {ROUTE_LINKS} from '../FilesRoutes'

const useStyles = makeStyles(
  ({ breakpoints, constants, palette }: CSFTheme) => {
    return createStyles({
      accountRestrictedNotification: {
        position: 'fixed',
        bottom: 0,
        backgroundColor: palette.additional["gray"][10],
        color: palette.additional['gray'][1],
        padding: '16px 24px',
        marginLeft: 0,
        width: '100vw',
        [breakpoints.up("md")]: {
          marginLeft: `${constants.navWidth}px`,
          left:0,
          width:`calc(100vw - ${constants.navWidth}px)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      },
    })
  }
)

const RestrictedModeBanner = () => {
    const classes = useStyles()
    const {desktop} = useThemeSwitcher()
    const { redirect } = useHistory()

    return (        
    <div className={classes.accountRestrictedNotification}>
      <Typography variant='body2'>
        <Trans>You've got a payment due. Until you've settled up, we've placed your account in restricted mode</Trans>
      </Typography>
      <Button 
        onClick={() => redirect(ROUTE_LINKS.SettingsPath('plan'))}
        fullsize={!desktop}>
          <Trans>Go to Payments</Trans>
      </Button>
    </div>)
}

export default RestrictedModeBanner