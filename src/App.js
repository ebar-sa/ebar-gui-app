import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import BarList from './pages/BarList'
import CreateVotings from './pages/VotingCreate'
import Votings from './pages/VotingList'
import VotingDetailUser from './pages/VotingDetail'

import Header from './components/Header'

import clsx from 'clsx'
import Mesas from './pages/Mesas'
import Sidebar from './components/Sidebar'
import useUser from './hooks/useUser'
import BarTableDetails from './components/mesa-details.component'
import UserMenuDetails from './components/user-menu.component'
import UserBillDetails from './components/user-bill.component'
import MenuGestion from './components/admin/menu-admin-gestion.component'
import Bar from "./pages/Bar";
import PrivateRoute from "./components/private-route.js";


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
          <Route exact path={'/bares/:barId'} component={Bar} />
          <Route exact path={'/bares/:idBar/menu'} component={MenuGestion} />
          <PrivateRoute exact path={"/votings"} component={Votings} />
          <PrivateRoute path={'/votings/voting/create'} component={CreateVotings} />
          <PrivateRoute path={'/votings/voting/:votingId'} component={VotingDetailUser} />
          <Route exact path={'/bar/bill/:id'} component={UserBillDetails} />
          <Route exact path={'/bar/menu/:id'} component={UserMenuDetails} />
          <Route exact path={'/mesas/detallesMesa/:id'} component={BarTableDetails}/>

        </Switch>
      </main>
    </div>
  )
}

export default App
