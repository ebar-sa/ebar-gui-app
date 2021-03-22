import { CssBaseline } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

import App from './App'
import { UserContextProvider } from './context/UserContext'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <HashRouter>
    <CssBaseline />
    <UserContextProvider>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </UserContextProvider>
  </HashRouter>,
  document.getElementById('root')
)

serviceWorker.unregister()
