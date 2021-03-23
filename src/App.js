import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext'

import { SnackbarProvider } from 'notistack'

import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import BarList from './pages/BarList'

import Header from './components/Header'

import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Sidebar from './components/Sidebar'
import useUser from './hooks/useUser'
import Mesas from './pages/Mesas'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    flexGrow: 1,
  },
}))

export function App() {
  const classes = useStyles()
  const { isLogged } = useUser()

  return (
    <div className={classes.root}>
      <Header classes={classes} />
      <Sidebar classes={classes} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isLogged,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route exact path={'/'} component={Home} />
          <Route exact path={'/bares'} component={BarList} />
          <Route exact path={'/mesas'} component={Mesas} />
          <Route exact path={'/login'} component={Login} />
          <Route exact path={'/profile'} component={Profile} />
        </Switch>
      </main>
    </div>
  )
}

export default App
