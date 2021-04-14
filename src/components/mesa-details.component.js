import React, { Component } from 'react';
import { Typography, CardContent, Grid, CardActions,Card,Button,Dialog, DialogActions, DialogContent,
  DialogContentText,DialogTitle, TextField,TableRow, Table, TableBody, TableHead, TableCell,ButtonGroup } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import MesaDataService from '../services/mesa.service';
import mesaLibre from '../static/images/table/mesaLibre.png'
import mesaOcupada from '../static/images/table/mesaOcupada.png'
import AuthService from '../services/auth.service';
import BillDataService from '../services/bill.service';
import { Redirect } from "react-router"
import MediaQuery from 'react-responsive';
import {ToastContainer} from 'react-toastify';

export default class BarTableDetails extends Component {
  constructor(props) {
    super(props)
    this.getMesasDetails = this.getMesasDetails.bind(this);
    this.changeStateToFree = this.changeStateToFree.bind(this);
    this.changeStateToOcupated = this.changeStateToOcupated.bind(this);
    this.isLogged = this.isLogged.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.automaticOcuppatioWithToken = this.automaticOcuppatioWithToken.bind(this);
    this.handleChangeToken = this.handleChangeToken.bind(this);
    this.currentWidth = this.currentWidth.bind(this);
    
    this.state = {
        mesaActual : {
          id : null,
          name: "",
          token: "", 
          free: "",
          seats: null,
          bar_id: null,
          trabajador_id: null
        },
        menuActual : {
          id : null,
          items: []
        },
        billActual : {
          id : null,
          itemBill: [],
          itemOrder: []
        },
        userName: "",
        isAdmin:false,
        openDialog: false,
        token: "",
        error: false,
        isPhoneScreen: false,
        showMenuPhone: true,
        showBillPhone: false,
        sortOptions: [{ id: 'name', desc: true }],
        openSubmitIncorrect: false
    }
  };

  componentDidMount() {
    this.getMesasDetails(this.props.match.params.id)
    this.isLogged();
    this.timer = setInterval(() => this.getMesasDetails(this.props.match.params.id), 30000);
  } 
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  isLogged(){
    const user = AuthService.getCurrentUser()
    user.roles.forEach((rol) => {
    if(rol === 'ROLE_OWNER'){
      this.setState({
        isAdmin : true
      })
    }
    })
  }
  currentWidth() {
    console.log(this.props.width);
  }
  getMesasDetails(id) {
    MesaDataService.getBarTable(id).then(res => { 
        this.setState({
            mesaActual : res.data[0],
            menuActual : res.data[1],
            billActual : res.data[2]
        })
    })
    .catch(e => {
      this.setState({
         error: true
       })
    })
  }
  handleClose(){
    this.setState({
      openDialog: false
    })
  }
  handleOpen() {
    this.setState({
      openDialog: true
    })
  }
  handleChangeToken(event) {
    this.setState({
      token: event.target.value
    })
  }
  
  changeStateToFree() {
    const id = this.props.match.params.id;
    MesaDataService.updateBarTableStateToFree(id).then(res => { 
      this.setState({  
        mesaActual:res.data[0],
        billActual:res.data[1],
        openDialog:false,
      })
    }).catch(e =>{
      console.log(e);
    })
  }
  changeStateToOcupated() {
    const id = this.props.match.params.id;
    MesaDataService.updateBarTableStateToBusy(id).then(res => { 
      this.setState({  
        mesaActual:res.data
      })
    }).catch(e =>{
      console.log(e);
    })
  }

  automaticOcuppatioWithToken() {
    const id = this.props.match.params.id;
    MesaDataService.ocupateBarTableByToken(id,this.state.token).then(res => {
      this.setState({
        mesaActual: res.data,
      })
    }).catch(e => {
      console.log(e);
    })
  }

  addToOrder(idItem) {
    const idBill = this.state.billActual.id;
    BillDataService.addToOrder(idBill, idItem).then(res => { 
      this.setState({  
        billActual:res.data
      })
    }).catch(e =>{
      console.log(e);
    })
  }

  addToBill(idItemBill) {
    const idBill = this.state.billActual.id;
    console.log(idBill);
    BillDataService.addToBill(idBill, idItemBill).then(res => { 
      this.setState({
        billActual:res.data
      })
    }).catch(e =>{
      console.log(e);
    })
  }

  render() {
    const useStyles = makeStyles((theme) => ({
      card: {
        margin: 16,
        display: "flex",
        flexDirection: "column",
        maxWidth: 100,
        justifyContent: "space-between"
      },
      title: {
        fontSize: 16,
      },
      buttonOcupar:{
        marginTop: '10px',
        marginBottom: '10px'
      },
      mesaLibre: {
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        width: 200,
        backgroundColor: 'yellow',
      },
      cardAction: {
        width: '100%',
      },
      nombreMesa: { 
        textAlign:'center',
        marginLeft: 15
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
      cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
      },
    }))

    const stylesComponent = {
      buttonAñadir: {
          backgroundColor: '#007bff',
          textTransform: 'none',
          letterSpacing: 'normal',
          fontSize: '15px',
          fontWeight: '600'
      },
      buttonMovil: { 
        margin: '0 auto'
      },
    }
      
    let total = this.state.billActual.itemBill.reduce((accumulator, currentValue) => 
    accumulator + currentValue.itemMenu.price*currentValue.amount, 0);

    const StyledTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: '#2A5DBC',
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
      },
      sizeSmall: {
        padding:'6px 9px 8px 0px'
      }
    }))(TableCell);
      
    const StyledTableRow = withStyles((theme) => ({
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
      },
    }))(TableRow);
    const {mesaActual, menuActual, billActual, isAdmin,userName,openDialog,error,showMenuPhone,showBillPhone} = this.state
    return !error ?
      <div>
        <ToastContainer/>
        <div>
        {/* Configuracion para movil */}
        <MediaQuery maxWidth={767}>
        <Grid container>
            <Grid item className={useStyles.cardGrid} component={Card} xs={12} align="center">
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom>
                  <span data-testid="tableId">{mesaActual.name}</span>
                </Typography>
                {mesaActual.free ? 
                <img alt="Mesa Libre" src={mesaLibre} />
                : 
                <img alt="Mesa Ocupada" src={mesaOcupada} />
                }
                {isAdmin ?
                  <Typography variant="h5"className={useStyles.title} gutterBottom> 
                    Código 
                  </Typography>
                :
                mesaActual.free ? 
                  <Typography variant="h6"className={useStyles.title} gutterBottom> 
                    Bienvenido comience ingresando el Código
                  </Typography>
                :
                  <Typography variant="h6"className={useStyles.title} gutterBottom>
                    Bienvenido {userName}
                  </Typography>
                }
                {isAdmin ? 
                  <Typography variant="h5"className={useStyles.title} gutterBottom> 
                    <span data-testid="tokenId">{mesaActual.token}</span>
                  </Typography>
                  :
                  <p></p>
                }
              </CardContent>
              {isAdmin ? 
              <CardActions>
                <div style={stylesComponent.buttonMovil}>
                  { mesaActual.free ? 
                    <Button variant="contained" color="primary" onClick = {this.changeStateToOcupated}>
                      Ocupar Manualmente
                    </Button>
                    :
                    <Button  variant="contained" color="secondary" onClick = {this.handleOpen}>
                      Desocupar Manualmente
                    </Button>

                  }
                </div>
              </CardActions>
              :
              <CardActions className={useStyles.buttonOcupar}>
               <div style={stylesComponent.buttonMovil}>
                {mesaActual.free ? 
                <form onSubmit={this.automaticOcuppatioWithToken}>
                  <TextField label="Outlined" variant="outlined" type="text" value={this.state.value} onChange={this.handleChangeToken} /><br></br>
                  <Button style={useStyles.buttonOcupar} variant="contained" color="primary" type="submit">Ocupar</Button>
                </form>
                :
                <h4>Ya tienes ocupada la mesa disfruta de tu estancia. De desocupar la mesa se encarga el Camarero.</h4>
                }
                </div>
              </CardActions>
              }
            </Grid>
            <Grid item component={Card} xs={12} align="center">
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom> 
                  Información
                </Typography> 
                <Typography variant="h6" className={useStyles.pos}>
                  {mesaActual.free ? 
                      <p>ESTADO: <span data-testid="freeId">Libre</span></p> 
                      :
                      <p>ESTADO: <span data-testid="notFreeId">Ocupada</span></p> 
                  } 
                </Typography>
                <Typography variant="h6" className={useStyles.title} gutterBottom> 
                    ASIENTOS: {mesaActual.seats}
                </Typography>  
              </CardContent>
            </Grid>
          </Grid>
          {!mesaActual.free ? 
          <Grid item container xs={12} >
            <ButtonGroup fullWidth={true} color="primary" aria-label="outlined primary button group" >
                <Button onClick={() => {this.setState({
                  showMenuPhone:true,
                  showBillPhone:false
                })}}>
                  Carta
                </Button>
                <Button onClick={() => {this.setState({
                  showMenuPhone:false,
                  showBillPhone:true
                })}}>
                  Pedidos y Cuenta
                </Button>
            </ButtonGroup>
          </Grid>
          :
          <p></p>
          }
          {!mesaActual.free && showBillPhone ? 
          <Grid>
          <Grid item component={Card} xs={12}>
            <CardContent>
              <Table size="small" aria-label="a dense table">
              <caption>PRODUCTOS PEDIDOS PERO NO ENTREGADOS</caption>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center"><Typography className={useStyles.title}><span>Nombre</span></Typography></StyledTableCell>
                    <StyledTableCell align="center"><Typography className={useStyles.title}><span>Precio</span></Typography></StyledTableCell>
                    <StyledTableCell align="center"><Typography className={useStyles.title}><span>Cantidad</span></Typography></StyledTableCell>
                    <StyledTableCell align="center"><Typography className={useStyles.title}><span>Entregado</span></Typography></StyledTableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                {billActual.itemOrder && billActual.itemOrder.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center" component="th" scope="row">
                       {row.itemMenu.name}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.price} €
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.amount}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    {isAdmin ? 
                    <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} onClick = {() => this.addToBill(row.id)} >
                      Entregado
                    </Button>
                    :
                    <p>-</p>
                    }
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                </TableBody> 
              </Table>
              <Button variant="contained" size='small' onClick = {() =>  this.getMesasDetails(this.props.match.params.id)}>
                  <span>Refrescar Comanda</span>
              </Button>
            </CardContent>
          </Grid>
          <Grid item component={Card} xs={12}>
            <CardContent>
              <Table size="small" aria-label="a dense table">
              <caption>PRODUCTOS PEDIDOS Y ENTREGADOS</caption>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"><Typography className={useStyles.title}><span>Nombre</span></Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography className={useStyles.title}><span>Precio</span></Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography className={useStyles.title}><span>Cantidad</span></Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography className={useStyles.title}><span>Total</span></Typography></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billActual.itemBill && billActual.itemBill.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.name}
                  </StyledTableCell>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.price} €
                  </StyledTableCell>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.amount}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.itemMenu.price*row.amount} €</StyledTableCell>
                </StyledTableRow>
                ))}
                <TableRow>
                  <TableCell align="right" colSpan={3}><Typography className={useStyles.body} gutterBottom><span>Total</span></Typography></TableCell>
                    <TableCell align="center"><Typography className={useStyles.body} gutterBottom><span> {total} € </span></Typography></TableCell>
                </TableRow>
              </TableBody>
              </Table>
            </CardContent>
          </Grid>
          </Grid>
          :
          <p></p>
          }
        </MediaQuery>
        {/* Vista PARA IPAD Y SUPERIOR */}
        <MediaQuery minWidth={768}>
          <Grid container justify="center">
            <Grid item component={Card} xs={4}>
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom>
                  <span data-testid="tableId">{mesaActual.name}</span>
                </Typography>
                {mesaActual.free ? 
                <img alt="Mesa Libre" src={mesaLibre} />
                : 
                <img alt="Mesa Ocupada" src={mesaOcupada} />
                }
              </CardContent>
            </Grid>
            <Grid item component={Card} xs={4}>
              <CardContent>
                {isAdmin ?
                  <Typography variant="h5"className={useStyles.title} gutterBottom> 
                    Código
                  </Typography>
                :
                mesaActual.free ? 
                  <Typography variant="h6"className={useStyles.title} gutterBottom> 
                    Bienvenido comience ingresando el Código
                  </Typography>
                :
                  <Typography variant="h6"className={useStyles.title} gutterBottom>
                    Bienvenido {userName}
                  </Typography>
                }
                {isAdmin ? 
                  <Typography variant="h5"className={useStyles.title} gutterBottom> 
                    <span data-testid="tokenId">{mesaActual.token}</span>
                  </Typography>
                  :
                  <p></p>
                }
              </CardContent>
              {isAdmin ? 
              <CardActions>
                  { mesaActual.free ? 
                    <Button variant="contained" color="primary" onClick = {this.changeStateToOcupated}>
                      Ocupar Manualmente
                    </Button>
                    :
                    <Button variant="contained" color="secondary" onClick = {this.handleOpen}>
                      Desocupar Manualmente
                    </Button>
                  }
              </CardActions>
              :
              <CardActions className={useStyles.buttonOcupar}>
                {mesaActual.free ? 
                <form onSubmit={this.automaticOcuppatioWithToken}>
                  <TextField label="Outlined" variant="outlined" type="text" value={this.state.value} onChange={this.handleChangeToken} /><br></br>
                  <Button style={useStyles.buttonOcupar} variant="contained" color="primary" type="submit">Ocupar</Button>
                </form>
                :
                <h4>Ya tienes ocupada la mesa disfruta de tu estancia. De desocupar la mesa se encarga el Camarero.</h4>
                }
              </CardActions>
              }
            </Grid>

            <Grid item component={Card} xs={4}>
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom> 
                  Información
                </Typography> 
                <Typography variant="h6" className={useStyles.pos}>
                  {mesaActual.free ? 
                      <p>ESTADO: <span data-testid="freeId">Libre</span></p> 
                      :
                      <p>ESTADO: <span data-testid="notFreeId">Ocupada</span></p> 
                  } 
                </Typography>
                <Typography variant="h6" className={useStyles.title} gutterBottom> 
                    ASIENTOS: {mesaActual.seats}
                </Typography>  
              </CardContent>
            </Grid>
          </Grid>
        </MediaQuery>        
        {!mesaActual.free && showMenuPhone ? 
        <Grid container spacing={0} justify="center">
          <Grid item component={Card} xs={12}>
            <CardContent>
              <Table size="small" aria-label="a dense table">
                <caption>CARTA</caption>
                <TableHead>
                  <TableRow >
                    <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
                    <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
                    <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Añadir</Typography></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuActual.items && menuActual.items.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell align="center" component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.price} €</StyledTableCell>
                      <StyledTableCell align="center">
                        <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} onClick = {() => this.addToOrder(row.id) }>
                          Añadir
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody> 
              </Table>
            </CardContent>
          </Grid>
          </Grid>
          :
          <p></p>
          }
          {!mesaActual.free ? 
          <div>
          <MediaQuery  minWidth={768} maxWidth={1024}>
          <Grid item component={Card} xs={12}>
            <CardContent>
              <Table size="small" aria-label="a dense table">
              <caption>PRODUCTOS PEDIDOS PERO NO ENTREGADOS</caption>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
                     <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
                     <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>
                     <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Entregado</Typography></StyledTableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                {billActual.itemOrder && billActual.itemOrder.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center" component="th" scope="row">
                       {row.itemMenu.name}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.price} €
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.amount}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    {isAdmin ? 
                    <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} onClick = {() => this.addToBill(row.id)}  >
                      Entregado
                    </Button>
                    :
                    <p>-</p>
                    }
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                </TableBody> 
              </Table>
              <Button variant="contained" size='small' onClick = {() => this.getMesasDetails(this.props.match.params.id)}>
                  <span>Refrescar Comanda</span>
              </Button>
            </CardContent>
          </Grid>
          <Grid item component={Card} xs={12}>
            <CardContent>
              <Table size="small" aria-label="a dense table">
              <caption>PRODUCTOS PEDIDOS Y ENTREGADOS</caption>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Total</Typography></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billActual.itemBill && billActual.itemBill.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.name}
                  </StyledTableCell>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.price} €
                  </StyledTableCell>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.amount}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.itemMenu.price*row.amount} €</StyledTableCell>
                </StyledTableRow>
                ))}
                <TableRow>
                  <TableCell align="right" colSpan={3}><Typography variant="h6"className={useStyles.body} gutterBottom>Total</Typography></TableCell>
                    <TableCell align="center"><Typography variant="h6"className={useStyles.body} gutterBottom> {total} € </Typography></TableCell>
                </TableRow>
              </TableBody>
              </Table>
            </CardContent>
          </Grid>
          </MediaQuery>
          <MediaQuery  minWidth={1025}>
          <Grid container justify='center'>
          <Grid item component={Card} xs={6}>
            <CardContent>
              <Table size="small" aria-label="a dense table">
              <caption>PRODUCTOS PEDIDOS PERO NO ENTREGADOS</caption>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
                     <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
                     <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>
                     <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Entregado</Typography></StyledTableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                {billActual.itemOrder && billActual.itemOrder.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center" component="th" scope="row">
                       {row.itemMenu.name}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.price} €
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.amount}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    {isAdmin ? 
                    <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} onClick = {() => this.addToBill(row.id)}  >
                      Entregado
                    </Button>
                    :
                    <p>-</p>
                    }
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                </TableBody> 
              </Table>
              <Button variant="contained" size='small' onClick = {() => this.getMesasDetails(this.props.match.params.id)}>
                  <span>Refrescar Comanda</span>
              </Button>
            </CardContent>
          </Grid>
          <Grid item component={Card} xs={6}>
            <CardContent>
              <Table size="small" aria-label="a dense table">
              <caption>PRODUCTOS PEDIDOS Y ENTREGADOS</caption>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Total</Typography></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billActual.itemBill && billActual.itemBill.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.name}
                  </StyledTableCell>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.itemMenu.price} €
                  </StyledTableCell>
                  <StyledTableCell align="center" component="th" scope="row">
                      {row.amount}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.itemMenu.price*row.amount} €</StyledTableCell>
                </StyledTableRow>
                ))}
                <TableRow>
                  <TableCell align="right" colSpan={3}><Typography variant="h6"className={useStyles.body} gutterBottom>Total</Typography></TableCell>
                    <TableCell align="center"><Typography variant="h6"className={useStyles.body} gutterBottom> {total} € </Typography></TableCell>
                </TableRow>
              </TableBody>
              </Table>
            </CardContent>
          </Grid>
          </Grid>
          </MediaQuery>
          </div>
          :
          <div>
          <h3 style={useStyles.mesaLibre}>La {mesaActual.name} se encuentra libre, ocupe la mesa para comenzar.</h3>
          </div>
        }
        {openDialog ? 
          <Dialog
            open={openDialog}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"¿Seguro que quieres desocupar la mesa?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Si lo haces todos los datos relacionados con la cuenta de esta mesa, serán eliminados, asegurate de que hayan pagado. 
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="secondary">
                Cancelar
              </Button>
              <Button onClick={this.changeStateToFree} color="primary" autoFocus>
                Si
              </Button>
            </DialogActions>
          </Dialog>
        :
          <p></p>
        }
        </div>        
      </div>
      :
      <div>
      <Redirect to="/pageNotFound"></Redirect>
      </div>
      }
  }
