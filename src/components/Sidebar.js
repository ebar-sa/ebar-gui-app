import React from 'react'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import useUser from '../hooks/useUser'
import { useHistory } from 'react-router'

export default function Sidebar(props) {
  const { isLogged } = useUser()
  const history = useHistory()
  const { classes } = props

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isLogged}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List>
        {[
          { label: 'Mesas', path: '/mesas' },
          { label: 'Carta', path: '/carta' },
          { label: 'Clientes', path: '/cliente' },
          { label: 'Configuracion', path: '/settings' },
          { label: 'Votaciones', path: '/votings'},
        ].map((item, index) => (
          <ListItem
            button
            key={item.label}
            onClick={() => history.push(item.path)}
          >
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
