import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import useUser from '../hooks/useUser'
import { AccountCircle } from '@material-ui/icons'
import { Menu, MenuItem } from '@material-ui/core'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import Logo from "../img/ebarLogoColor2.png"
import Avatar from '@material-ui/core/Avatar'

import clsx from 'clsx'


const useStyles = makeStyles((theme) => ({
  but: {
    marginLeft: 'auto',
  },
  logo: {
    margin: 'auto',
  },
  white: {
    color: 'white',
  },
}));


export default function Header(props) {
  const { isLogged, logout, auth } = useUser()
  const { classes } = props
  const classes2 = useStyles();

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
        <Button href="/" >
          <HomeRoundedIcon className={classes2.white} href="/">
          </HomeRoundedIcon></Button>
        <Button href="/" className={classes.title} disabled>
          <Avatar alt="Ebar" className={classes2.logo} src={Logo} />
        </Button>

        {isLogged ? (
          <div className={classes2.but}>
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
          <div className={classes2.but}>
            <Button href="#login" >
              <AccountCircle className={classes2.white} href="/">
              </AccountCircle></Button>
          </div>
        )}
      </Toolbar>
    </AppBar >
  )
}
