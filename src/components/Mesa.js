import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography'
import { ButtonBase, Button, ButtonGroup, Grid, Snackbar } from '@material-ui/core'
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
    backgroundColor: '#00cca0',
  },
  free: {
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#dddddd',
  },
  cardAction: {
    width: '100%',
  },
  buttonEditar: {
    backgroundColor: '#006e85'
  },
  buttonBorrar: {
    backgroundColor: '#3ef386'
  },
  buttonDeshabilitar: {
    backgroundColor: '#e2e02c'
  },
  snak: {
    marginBottom: '20px',
  }
})

export function Mesa(props) {
  const classes = useStyles()
  const { id, name, free, available } = props
  const history = useHistory()
  const [openRemoveCorrect, setOpenRemoveCorrect] = useState(false)
  const [openRemoveInCorrect, setOpenRemoveInCorrect] = useState(false)
  const [openAvaliableIncorrect, setOpenAvaliableIncorrect] = useState(false)
  const [openDetailsIncorrect, setOpenDetailsIncorrect] = useState(false)

  const routeRedirect = () => {
    if (available) {
      let path = `/mesas/detallesMesa/${id}`;
      history.push(path);
    } else {
      setOpenDetailsIncorrect(true)
    }
  }
  const isAdmin = props.isAdmin;
  const idBar = props.idBar;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenRemoveCorrect(false)
    setOpenRemoveInCorrect(false)
    setOpenAvaliableIncorrect(false)
    setOpenDetailsIncorrect(false)

  };
  const removeBarTable = () => {
    MesaDataService.removeBarTable(idBar, id).then(res => {
      if(res.status === 200){
        history.go(0);
        setOpenRemoveCorrect(true)
      }else{
        setOpenRemoveInCorrect(true)
      }
    })
  }
  const disableBarTable = () => {
    MesaDataService.disableBarTable(id).then(res => {
      history.go(0);
    }, e => {
      setOpenAvaliableIncorrect(true)
    })
  }
  const enableBarTable = () => {
    MesaDataService.enableBarTable(id).then(res => {
      history.go(0);
    })
  }
  const isAvailable = available ? classes.free : classes.disabled
  const isFreeAndAvailable = free ? isAvailable : classes.occupied
  const availableOptions = available ?
      <Button className={classes.buttonDeshabilitar} onClick={() => disableBarTable()}>Deshabilitar
        Mesa</Button>
      :
      <Button className={classes.buttonDeshabilitar} onClick={() => enableBarTable()}>Habilitar Mesa</Button>
  return (
    <div>
      <Card className={isFreeAndAvailable} variant="outlined">
        <ButtonBase
          className={classes.cardAction}
          onClick={routeRedirect}>
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
            <Button className={classes.buttonBorrar} onClick={() => removeBarTable()}>Eliminar Mesa</Button>
            {
              availableOptions
            }
          </ButtonGroup>
        </Grid>
        :
        null
      }
      <Snackbar open={openRemoveCorrect} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Has borrado correctamente la mesa
         </Alert>
      </Snackbar>
      <Snackbar open={openAvaliableIncorrect} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          No se puede deshabilitar una mesa ocupada
        </Alert>
      </Snackbar>
      <Snackbar open={openDetailsIncorrect} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Habilita la mesa para acceder a los detalles
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Mesa
