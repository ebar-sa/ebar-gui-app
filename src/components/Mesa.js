import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { ButtonBase,Button, ButtonGroup,Grid } from '@material-ui/core'
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
  buttonEditar: {
    backgroundColor: '#fffacd'
  },
  buttonBorrar:{
    backgroundColor: '#fca491'
  }
})

export function Mesa(props) {
  const classes = useStyles()
  const {id, name, free } = props
  const history = useHistory()

  const routeRedirect = () => {
    let path = `/mesas/detallesMesa/${id}`;
    history.push(path);
  } 
  const isAdmin = props.isAdmin; 

  const removeBarTable = () => {
    console.log("Estoy intentando eliminar");
  }
  return (
    <div>
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
          <Typography variant="body2" component="p">
            {free ? 'Libre' : 'Ocupada'}
          </Typography>
        </CardContent>
      </ButtonBase>
    </Card>
    {isAdmin ? 
    <Grid item container xs={12}>
        <ButtonGroup fullWidth={true} aria-label="outlined primary button group" >
            <Button className={classes.buttonEditar} href={`/#/mesas/${id}/edit`}>Editar Mesa</Button>
            <Button className={classes.buttonBorrar} onClick={() => removeBarTable(id)}>Eliminar Mesa</Button>
        </ButtonGroup>
    </Grid>
    :
    <p></p>
    }
    </div>
  )
}

export default Mesa
