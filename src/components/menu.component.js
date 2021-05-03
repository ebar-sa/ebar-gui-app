import React, { Component } from 'react'
import MenuDataService from '../services/menu.service'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Typography, CardContent, Grid, Card, Snackbar, TableRow, Table, TableBody, TableCell, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core'
import Button from "@material-ui/core/Button"
import * as AuthService from '../services/auth'
import Alert from '@material-ui/lab/Alert'
import Paper from "@material-ui/core/Paper/Paper"
import BarDataService from "../services/bar.service"
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.getMenuDetails = this.getMenuDetails.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.isLogged = this.isLogged.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.state = {
      mapa: {},
      idBar: this.props.match.params.idBar,
      isAdmin: false,
      alerta: false,
      showModal: false,
      item: []
    };
  }

  componentDidMount() {
    this.setState({
      idBar: this.props.match.params.idBar
    })
    this.getMenuDetails(this.props.match.params.idBar);
    this.isLogged();
  }

  isLogged(){
    const username = AuthService.getCurrentUser().username
    BarDataService.getBar(this.state.idBar).then(res => {
      let owner = res.data.owner
      let emp = res.data.employees.map(a => a.username)
      if ((owner === username || emp.includes(username))) {
        this.setState({
          isAdmin: true
        })
      }
    }).catch(err => {
      this.props.history.push('/pageNotFound/')
    })
  }

  handleClose() {
    this.setState({
      alerta: false
    })
  }

  handleShowModal(row){
    this.setState({
      showModal: true,
      item: row
    })
  }

  handleCloseModal() {
    this.setState ({
       showModal: false
    })
  }

  getMenuDetails(idBar) {
    MenuDataService.getMenu(idBar).then(res => {
      this.setState({
        mapa: res.data,
      })
    })
      .catch(e => {
        console.log(e)
      })
  }

  deleteItem(idBar, idItemMenu) {
    MenuDataService.deleteItem(idBar, idItemMenu).then(response => {
      if (response.status === 200) {
        this.props.history.go(0)
      }
    }).catch(error => {
      this.setState({
        alerta: true
      })
      console.log("Error " + error)
    })
  }

  deleteImage(idBar, idItemMenu) {
    MenuDataService.deleteImage(idBar, idItemMenu).then(response => {
      if (response.status === 200) {
        this.props.history.go(0)
      }
    }).catch(error => {
      this.props.history.push('/pageNotFound/')
      console.log("Error " + error)
    })
  }

  render() {
    const useStyles = makeStyles({
      title: {
        fontSize: '10vw',
      }
    })

    const {mapa, idBar, isAdmin, alerta, showModal, item} = this.state

    const StyledTableRow = withStyles((theme) => ({
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
      },
    }))(TableRow);

    const stylesComponent = {
      buttonCreate: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center'
      },
      buttonDelete: {
        color: '#FF0000'
      },
      buttonDeleteImage: {
        color: '#FF0000',
        display: 'contents'
      },
      buttonBack: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center'
      }
    }

    const StyledTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: '#006e85',
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 12,
        padding: "6px 10px 6px 0px"
      },
    }))(TableCell);

    const logo = require('../img/no-image.png');

    return (
      <>
      <div style={{ "marginBottom": "45px" }}>
        <Grid container spacing={0} justify="center" style={{ "display": "contents" }} >
          <Grid item component={Card} xs>
            <CardContent>
              <Snackbar open={alerta} autoHideDuration={6000} onClose={this.handleClose}>
                <Alert onClose={this.handleClose} severity="error">
                  No se puede borrar el item hasta que no se encuentre en ninguna cuenta.
                </Alert>
              </Snackbar>
              <div style={{ "textAlign": "center" }}>
              {isAdmin ?
                <Button variant="contained" color="primary" href={`/#/bares/${idBar}/menu/itemMenu`} startIcon={<AddIcon/>}>Añadir</Button>
                : null
              }
              </div>
            </CardContent>
            <CardContent>
              <Paper style={{ overflowX: "auto"}}>
                <Table size="small" aria-label="a dense table" style={{textAlign: "center"}}>
                  <TableBody>
                  {Object.keys(mapa).map((category) =>
                    <div style={{textAlign: "-webkit-center"}}>
                    <h2>{category}</h2>
                    {mapa[category].map((row) => (
                      <StyledTableRow>
                        <StyledTableCell>
                          <Button data-testid="nombreItem" type="button" onClick={() => this.handleShowModal(row)}> 
                            {row.name} 
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell >
                          <span data-testid="priceItem">{row.price} €</span>
                        </StyledTableCell>
                        <StyledTableCell>{(row.image != null) ? <img alt="" src={"data:" + row.image.type + ";base64," + row.image.data}
                          style={{
                            "width": "85px",
                            "height": "85px"
                          }} /> :
                          <img alt="" src={logo.default}
                            style={{
                              "width": "85px",
                              "height": "85px"
                            }} />}
                          {(isAdmin && row.image != null) ?
                            <IconButton variant="contained" size='small' style={{...stylesComponent.buttonDeleteImage}} onClick={() => this.deleteImage(idBar, row.id)}><HighlightOffIcon/></IconButton>
                          : null
                          }
                        </StyledTableCell>
                        {isAdmin ?
                          <StyledTableCell>
                            <IconButton variant="contained" size='small' color="primary" href={`/#/bares/${idBar}/menu/itemMenu/${row.id}`}><EditIcon/></IconButton>
                            <IconButton variant="contained" size='small'  style={{...stylesComponent.buttonDelete}} onClick={() => this.deleteItem(idBar, row.id)}><DeleteIcon/></IconButton>
                            </StyledTableCell>
                          : null
                        }
                      </StyledTableRow>   
                              
                    ))}
                    </div>)}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
            <CardContent>
              <div style={{ "textAlign": "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ ...stylesComponent.buttonBack }}
                  onClick={() => this.props.history.goBack()}>
                  Volver
                        </Button>
              </div>
            </CardContent>
          </Grid>
        </Grid>
        <Dialog
          open={showModal}
          onClose={this.handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle align="center" id="alert-dialog-title">
          {item.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText align="center" id="alert-dialog-description">
          {(item.image != null) ? <img alt="" src={"data:" + item.image.type + ";base64," + item.image.data}
            style={{
              "width": "100px",
              "height": "100px"
            }} /> :
            <img alt="" src={logo.default}
              style={{
                "width": "100px",
                "height": "100px"
          }} />}
          <Typography variant="h5" className={useStyles.title} gutterBottom>Categoría: {item.category}</Typography>
          {(item.description!=null) ?
          <Typography variant="h5" className={useStyles.title} gutterBottom>Descripción: {item.description}</Typography>
            : null
          }
          <Typography variant="h5" className={useStyles.title} gutterBottom>Cantidad: {item.rationType}</Typography>
          <Typography variant="h5" className={useStyles.title} gutterBottom>Precio: {item.price} €</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseModal} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      </>
    );

  }

}