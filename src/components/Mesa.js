import React, {useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography'
import { ButtonBase,Button, ButtonGroup,Grid, Snackbar } from '@material-ui/core'
import MesaDataService from '../services/barTable.service'
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
  },
  snak: {
    marginBottom: '20px',
  }
})

export function Mesa(props) {
  const classes = useStyles()
  const {id, name, free } = props
  const history = useHistory()
  const [openRemoveCorrect, setOpenRemoveCorrect] = useState(false)

  const routeRedirect = () => {
    let path = `/mesas/detallesMesa/${id}`;
    history.push(path);
  } 
  const isAdmin = props.isAdmin; 
  const idBar = props.idBar;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenRemoveCorrect(false)
  };
  const removeBarTable = () => {
    MesaDataService.removeBarTable(idBar,id).then(res => { 
      history.go(0);
      setOpenRemoveCorrect(true)
    })
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
            <Button className={classes.buttonEditar} href={`/#/mesas/bar/${idBar}/mesa/${id}/edit`}>Editar Mesa</Button>
            <Button className={classes.buttonBorrar} onClick={() => removeBarTable(id)}>Eliminar Mesa</Button>
        </ButtonGroup>
    </Grid>
    :
    <p></p>
    }
    <Snackbar  open={openRemoveCorrect} autoHideDuration={6000} onClose={handleClose}>
         <Alert onClose={handleClose} severity="error">
            Has borrado correctamente la mesa
         </Alert>
     </Snackbar>
    </div>
  )
}

export default Mesa
