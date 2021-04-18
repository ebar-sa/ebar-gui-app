import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import useUser from '../hooks/useUser'
import { AccountCircle } from '@material-ui/icons'
import { Menu, MenuItem } from '@material-ui/core'
import { useHistory } from 'react-router'

import clsx from 'clsx'

export default function Header(props) {
  const { isLogged, logout, auth } = useUser()
  const { classes } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const history = useHistory()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isLogged,
      })}
    >
      <Toolbar>
        <Typography variant="h6">EBAR</Typography>
        <Button color="inherit" href="#bares" className={classes.title}>
          Bares
        </Button>
        {isLogged ? (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => history.push('/profile')}>
                Perfil
              </MenuItem>
              {auth.roles.includes('ROLE_OWNER') && (
                <MenuItem
                  onClick={() => history.push('/payments/subscriptions')}
                >
                  Mis suscripciones
                </MenuItem>
              )}
              <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button color="inherit" href="#login">
            Iniciar sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
