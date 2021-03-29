import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { ButtonBase } from '@material-ui/core'
import { useHistory } from "react-router"
const useStyles = makeStyles({
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  occupied: {
    backgroundColor: '#ddd',
  },
  free: {
    backgroundColor: '#fff',
  },
  cardAction: {
    width: '100%',
  },
})

export function Mesa(props) {
  const classes = useStyles()
  const {id, name, free, token } = props
  const history = useHistory()
  const routeRedirect = () => {
    console.log(id);
    let path = `/mesas/detallesMesa/${id}`;
    history.push(path);

  }

  return (
    <Card className={free ? classes.free : classes.occupied} variant="outlined">
      <ButtonBase
        className={classes.cardAction}
        onClick= {routeRedirect}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Mesa
          </Typography>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {token}
          </Typography>
          <Typography variant="body2" component="p">
            {free ? 'Libre' : 'Ocupada'}
          </Typography>
        </CardContent>
      </ButtonBase>
    </Card>
  )
}

export default Mesa
