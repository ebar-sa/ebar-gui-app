import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import BarList from './pages/BarList'
import CreateVotings from './pages/VotingCreate'
import Votings from './pages/VotingList'
import VotingDetailUser from './pages/VotingDetail'
import Subscriptions from './pages/Subscriptions'
import EditVoting from './pages/VotingEdit'

import Header from './components/Header'

import clsx from 'clsx'
import EmployeeList from './components/employee-list.component'
import Mesas from './pages/Mesas'
import BottomBar from './components/bottom-bar'
import useUser from './hooks/useUser'
import BarTableDetails from './components/mesa-details.component'
import UserMenuDetails from './components/user-menu.component'
import UserBillDetails from './components/user-bill.component'
import MenuGestion from './components/admin/menu-admin-gestion.component'
import CreateEmployee from './pages/EmployeeCreate'
import UpdateEmployee from './pages/EmployeeUpdate'
import Bar from './pages/Bar'
import PrivateRoute from './components/private-route.js'
import NotFoundPage from './hooks/pageError'
import EmployeeDetails from './components/employee-details.component'
import Checkout from './pages/Checkout'
import Subscribe from './pages/Subscribe'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: '1',
    overflowY: 'auto',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
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
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
  colorBar: {
    backgroundColor: 'white',
  },
}))

export function App() {
  const classes = useStyles()
  const { isLogged } = useUser()

  return (
    <div className={classes.root}>
      <Header classes={classes} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isLogged,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route exact path={'/'} component={Home} />
          <PrivateRoute exact path={'/bares'} component={BarList} />
          <Route exact path={'/mesas/:barId'} component={Mesas} />
          <Route exact path={'/login'} component={Login} />
          <Route exact path={'/signup'} component={Signup} />
          <Route exact path={'/profile'} component={Profile} />
          <PrivateRoute exact path={'/bares/:barId'} component={Bar} />
          <PrivateRoute exact path={'/bares/:idBar/menu'} component={MenuGestion} />
          <PrivateRoute exact path={"/bares/:idBar/votings"} component={Votings} />
          <PrivateRoute exact path={'/bares/:idBar/votings/voting/create'} component={CreateVotings} />
          <PrivateRoute exact path={'/bares/:idBar/votings/voting/:votingId/edit'} component={EditVoting} />
          <PrivateRoute path={'/bares/:idBar/votings/voting/:votingId'} component={VotingDetailUser} />
          <PrivateRoute exact path={'/bar/bill/:id'} component={UserBillDetails} />
          <PrivateRoute exact path={'/bar/menu/:id'} component={UserMenuDetails} />
          <PrivateRoute exact path={'/mesas/detallesMesa/:id'} component={BarTableDetails} />
          <PrivateRoute exact path={'/bar/:idBar/employees'} component={EmployeeList} />
          <PrivateRoute exact path={'/bar/:idBar/employees/create'} component={CreateEmployee} />
          <PrivateRoute exact path={'/bar/:idBarActual/employees/update/:userActual'} component={UpdateEmployee} />
          <PrivateRoute exact path={'/bar/:idBar/employees/:user'} component={EmployeeDetails} />
          <PrivateRoute exact path={'/pageNotFound/'} component={NotFoundPage}/>
          <PrivateRoute
            exact
            path={'/payments/subscriptions'}
            component={Subscriptions}
          />
          <PrivateRoute
            exact
            path={'/payments/add-card'}
            component={Checkout}
          />
          <PrivateRoute
            exact
            path={'/payments/subscribe/:id'}
            component={Subscribe}
          />
          <PrivateRoute
            exact
            path={'/payments/cancel/:id'}
            component={Checkout}
          />
        </Switch>
      </main>
      <div className={classes.colorBar}>
        <BottomBar classes={classes} />
      </div>
    </div>
  )
}

export default App
