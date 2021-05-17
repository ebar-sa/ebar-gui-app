import React, { Component } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
  Typography,
  CardContent,
  Grid,
  CardActions,
  Card,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableRow,
  Table,
  TableBody,
  TableHead,
  TableCell,
  ButtonGroup,
  Snackbar,
  LinearProgress,
} from '@material-ui/core';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import MesaDataService from '../services/barTable.service';
import mesaLibre from '../static/images/table/mesaLibre.png';
import mesaOcupada from '../static/images/table/mesaOcupada.png';
import { getCurrentUser } from '../services/auth';
import BillDataService from '../services/bill.service';
import { Redirect } from 'react-router';
import BottomBar from './SimpleBottomNavigation';
import BillCheckout from "../pages/BillCheckout";
import TextField from '@material-ui/core/TextField';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#006e85',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
  sizeSmall: {
    padding: '6px 9px 8px 0px',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default class BarTableDetails extends Component {
  constructor(props) {
    super(props)
    this.getMesasDetails = this.getMesasDetails.bind(this)
    this.changeStateToFree = this.changeStateToFree.bind(this)
    this.changeStateToOcupated = this.changeStateToOcupated.bind(this)
    this.isLogged = this.isLogged.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChangeToken = this.handleChangeToken.bind(this)
    this.handleOpenPayment = this.handleOpenPayment.bind(this)
    this.handleClosePayment = this.handleClosePayment.bind(this)
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
    this.timer = 0
    this.timer2 = 0
    this.timerLoadinBar = 0
    this.state = {
      symbolsArr: ['e', 'E', '+', '-', '.', ',', '+', '', '´', '`'],
      mesaActual: {
        id: null,
        name: '',
        token: '',
        free: '',
        seats: null,
        bar_id: null,
        trabajador_id: null,
      },
      menuActual: {
        id: null,
        items: [],
      },
      billActual: {
        id: null,
        itemBill: [],
        itemOrder: [],
        paid: ''
      },

      amountActual: [],
      amountDefault: null,
      name: '',
      isAdmin: false,
      openDialog: false,
      openPaymentDialog: false,
      openSuccess: false,
      successReview: props.history?.location.state? props.history.location.state.review : false,
      token: '',
      error: false,
      isPhoneScreen: false,
      showMenuPhone: true,
      showBillPhone: false,
      width: 0,
      height: 0,
      showModalInputZero: false,
      progressBarHidden: false,
      paymentSet: false
    }
  }

  componentDidMount() {
    this.setState({progressBarHidden : true});

    this.timerLoadinBar = setTimeout(() => {this.setState({
      progressBarHidden: false
    })},1000);
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
    this.getMesasDetails(this.props.match.params.id)
    this.isLogged()
    const user = getCurrentUser();
    if(!user.roles.includes('ROLE_OWNER') &&
        !user.roles.includes('ROLE_EMPLOYEE')) {
      this.checkBarPaymentIsSet(this.props.match.params.id)
    }

    this.timer = setInterval(() => this.bannedClientFromTable(), 10000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    clearInterval(this.timerLoadinBar);
    window.removeEventListener('resize', this.updateDimensions);
  }

  bannedClientFromTable() {
    const user = getCurrentUser();
    if (user.roles.includes('ROLE_CLIENT')) {
      MesaDataService.getBarTableClient(user.username)
          .then((res) => {
            if (res.status === 204) {
              this.props.history.push('/');
            }
          })
          .catch((e) => {
            this.props.history.push('/');
          });
    }
  }

  isLogged() {
    const user = getCurrentUser();
    this.setState({
      isAdmin:
          user.roles.includes('ROLE_OWNER') ||
          user.roles.includes('ROLE_EMPLOYEE'),
    });
    if (user.roles.includes('ROLE_CLIENT')) {
      this.setState({
        name: user.firstName,
      });
    }
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (window.innerWidth < 768) {
      this.setState({
        isPhoneScreen: true,
      });
    } else {
      this.setState({
        isPhoneScreen: false,
      });
    }
  }
  getMesasDetails(id) {
    MesaDataService.getBarTable(id)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              mesaActual: res.data[0],
              menuActual: res.data[1],
              billActual: res.data[2],
              amountActual: [],
            });
          } else if (res.status === 204) {
            this.props.history.push('/#/');
          }
        })
        .catch((e) => {
          if (e.response?.status === 402) {
            this.props.history.push(`/payments/subscribe/${e.response.data[3]}`);
          } else {
            this.setState({
              error: true,
            });
          }
        });
  }

  handleClose() {
    this.setState({
      openDialog: false,
      showModalInputZero: false,
      amountActual: [],
    });
  }

  handleOpen() {
    this.setState({
      openDialog: true,
      amountActual: [],
    });
  }

  handleClosePayment(success) {
    this.setState({
      openPaymentDialog: false
    })

    if (success) {
      this.props.history.push({pathname: '/', state: {data: success}})
    }
  }

  handleOpenPayment() {
    this.setState({
      openPaymentDialog: true,
    })
  }

  handleChangeToken(event) {
    this.setState({
      token: event.target.value,
    });
  }

  changeStateToFree() {
    const id = this.props.match.params.id;
    MesaDataService.updateBarTableStateToFree(id)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              mesaActual: res.data[0],
              billActual: res.data[1],
              openDialog: false,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
  }
  changeStateToOcupated() {
    const id = this.props.match.params.id;
    MesaDataService.updateBarTableStateToBusy(id)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              mesaActual: res.data,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
  }

  addToOrder(idItem) {
    const idBill = this.state.billActual.id;
    BillDataService.addToOrder(idBill, idItem)
        .then((res) => {
          this.setState({
            billActual: res.data,
            amountActual: [],
          });
        })
        .catch((e) => {
          console.log(e);
        });
  }

  addAmountToOrder(idItem, amount) {
    const idBill = this.state.billActual.id;
    BillDataService.addAmountToOrder(idBill, idItem, amount)
        .then((res) => {
          this.setState({
            billActual: res.data,
            amountActual: [],
          });
        })
        .catch((e) => {
          console.log(e);
        });
  }

  addToBill(idItemBill) {
    const idBill = this.state.billActual.id;
    BillDataService.addToBill(idBill, idItemBill)
        .then((res) => {
          this.setState({
            billActual: res.data,
            amountActual: [],
          });
        })
        .catch((e) => {
          console.log(e);
        });
  }

  addAllToBill(idItemBill) {
    const idBill = this.state.billActual.id
    BillDataService.addAllToBill(idBill, idItemBill)
        .then((res) => {
          this.setState({
            billActual: res.data,
            amountActual: [],
          });
        })
        .catch((e) => {
          console.log(e);
        });
  }

  deleteBill(idItemBill) {
    const idBill = this.state.billActual.id;
    BillDataService.deleteBill(idBill, idItemBill)
        .then((res) => {
          this.setState({
            billActual: res.data,
            amountActual: [],
          });
        })
        .catch((e) => {
          console.log(e);
        });
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      openSuccess: false,
      successReview: false
    })
  };

  checkBarPaymentIsSet(id) {
    return MesaDataService.checkBarPaymentIsSet(id)
        .then((response) => {
          this.setState({paymentSet: response.data.paymentSet})
        })
        .catch((err) => {
          console.log(err)
          this.setState({paymentSet: false})
        })
  }

  render() {
    const useStyles = makeStyles((theme) => ({
      card: {
        margin: 16,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 100,
        justifyContent: 'space-between',
      },
      title: {
        fontSize: 16,
      },
      buttonOcupar: {
        marginTop: '10px',
        marginBottom: '10px',
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
        textAlign: 'center',
        marginLeft: 15,
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
    }));

    const stylesComponent = {
      buttonPayReview: {
        textTransform: 'none',
        letterSpacing: 'normal',
      },
      buttonCrear: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        marginLeft: '5px',
      },
      buttonAdd: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
      },
      textField: {
        width: 80,
      },
      buttonMovil: {
        margin: '0 auto',
      },
      buttonMovilBill: {
        margin: '5px 5px 5px 5px',
        width: 20,
      },
      buttonVolver: {
        marginLeft: '10px',
      },
      colorBar: {
        backgroundColor: 'white',
      },
      gridBill: {
        margin: '15px 0px 50px 0px',
      },
    };

    let total = this.state.billActual.itemBill.reduce(
        (accumulator, currentValue) =>
            accumulator + currentValue.itemMenu.price * currentValue.amount,
        0
    );

    const {
      mesaActual,
      menuActual,
      billActual,
      isAdmin,
      name,
      openDialog,
      openPaymentDialog,
      error,
      showMenuPhone,
      showBillPhone,
      isPhoneScreen,
      openSuccess,
      showModalInputZero,
      progressBarHidden,
      paymentSet,
      successReview
    } = this.state
    return !error ? (
        <div style={{ maxWidth: 1400, margin: '50px auto' }}>
          <LinearProgress hidden={!progressBarHidden} />
          <div className={stylesComponent.colorBar}>
            <BottomBar props={true} />
          </div>
          <Snackbar
              open={showModalInputZero}
              autoHideDuration={6000}
              onClose={this.handleClose}
          >
            <Alert onClose={this.handleClose} severity="warning">
              Introduce una cantidad
            </Alert>
          </Snackbar>

          <div>
            {isPhoneScreen ? (
                <div>
                  <Grid container>
                    <Grid
                        item
                        className={useStyles.cardGrid}
                        component={Card}
                        xs={12}
                        align="center"
                    >
                      <CardContent>
                        <Typography
                            variant="h5"
                            className={useStyles.title}
                            gutterBottom
                        >
                          <span data-testid="tableId">{mesaActual.name}</span>
                        </Typography>
                        {mesaActual.free ? (
                            <img alt="Mesa Libre" src={mesaLibre} />
                        ) : (
                            <img alt="Mesa Ocupada" src={mesaOcupada} />
                        )}

                        {isAdmin && mesaActual.free ?(
                            <div>
                              <Typography
                                  variant="h5"
                                  className={useStyles.title}
                                  gutterBottom
                              >
                                Código
                              </Typography>
                              <Typography
                                  variant="h5"
                                  className={useStyles.title}
                                  gutterBottom
                              >
                                <span data-testid="tokenId">{mesaActual.token}</span>
                              </Typography>
                            </div>
                        ) : isAdmin && !mesaActual.free ? (
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Comienza a gestionar esta mesa
                                </Typography>
                            ) :
                            <Typography
                                variant="h6"
                                className={useStyles.title}
                                gutterBottom
                            >
                              Bienvenido/a, {name}
                            </Typography>
                        }
                      </CardContent>
                      {isAdmin ? (
                          <CardActions>
                            <div style={stylesComponent.buttonMovil}>
                              {mesaActual.free ? (
                                  <div align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.changeStateToOcupated}
                                    >
                                      Ocupar Manualmente
                                    </Button>
                                    <Button
                                        style={stylesComponent.buttonVolver}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.props.history.goBack()}
                                    >
                                      Volver
                                    </Button>
                                  </div>
                              ) : (
                                  <div align="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.handleOpen}
                                    >
                                      Desocupar Manualmente
                                    </Button>
                                    <Button
                                        style={stylesComponent.buttonVolver}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.props.history.goBack()}
                                    >
                                      Volver
                                    </Button>
                                  </div>
                              )}
                            </div>
                          </CardActions>
                      ) : (
                          <CardActions className={useStyles.buttonOcupar}>
                            <div style={stylesComponent.buttonMovil}>
                              {!mesaActual.free && (
                                  <h4>
                                    Ya tienes ocupada la mesa, ¡disfruta de tu estancia!
                                  </h4>
                              )}
                            </div>
                          </CardActions>
                      )}
                    </Grid>
                    <Grid item component={Card} xs={12} align="center">
                      <CardContent>
                        <Typography
                            variant="h5"
                            className={useStyles.title}
                            gutterBottom
                        >
                          Información
                        </Typography>
                        <Typography variant="h6" className={useStyles.pos}>
                          {mesaActual.free ? (
                              <p>
                                ESTADO: <span data-testid="freeId">Libre</span>
                              </p>
                          ) : (
                              <p>
                                ESTADO: <span data-testid="notFreeId">Ocupada</span>
                              </p>
                          )}
                        </Typography>
                        <Typography
                            variant="h6"
                            className={useStyles.title}
                            gutterBottom
                        >
                          ASIENTOS: {mesaActual.seats}
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                  <div>
                    {!mesaActual.free ? (
                        <Grid item container xs={12}>
                          <ButtonGroup
                              fullWidth={true}
                              color="primary"
                              aria-label="outlined primary button group"
                          >
                            <Button
                                onClick={() => {
                                  this.setState({
                                    showMenuPhone: true,
                                    showBillPhone: false,
                                  });
                                }}
                            >
                              Carta
                            </Button>
                            <Button
                                onClick={() => {
                                  this.setState({
                                    showMenuPhone: false,
                                    showBillPhone: true,
                                  });
                                }}
                            >
                              Pedidos y Cuenta
                            </Button>
                          </ButtonGroup>
                        </Grid>
                    ) : (
                        <p></p>
                    )}
                  </div>
                  <div>
                    {!mesaActual.free && showBillPhone ? (
                        <Grid container style={stylesComponent.gridBill}>
                          <Grid item component={Card} xs={12}>
                            <CardContent>
                              <Table size="small" aria-label="a dense table">
                                <caption>
                                  PRODUCTOS PEDIDOS PERO NO ENTREGADOS
                                </caption>
                                <TableHead >
                                  <TableRow>
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Nombre</span>
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Precio</span>
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Cantidad</span>
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Acciones</span>
                                      </Typography>
                                    </StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {billActual.itemOrder &&
                                  billActual.itemOrder.map((row) => (
                                      <StyledTableRow key={row.id}>
                                        <StyledTableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                        >
                                          {row.itemMenu.name}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                        >
                                          {row.itemMenu.price} €
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                        >
                                          {row.amount}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                          {isAdmin ? (
                                              <div>
                                                <Button
                                                    id="order"
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    style={{
                                                      ...stylesComponent.buttonCrear,
                                                    }}
                                                    onClick={() => this.addToBill(row.id)}
                                                >
                                                  <AddCircleIcon />
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    style={{
                                                      ...stylesComponent.buttonCrear,
                                                    }}
                                                    onClick={() =>
                                                        this.addAllToBill(row.id)
                                                    }
                                                >
                                                  Todo
                                                </Button>

                                                <Button
                                                    id="remove"
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    style={{
                                                      ...stylesComponent.buttonMovilBill,
                                                    }}
                                                    onClick={() =>
                                                        this.deleteBill(row.id)
                                                    }
                                                >
                                                  <DeleteIcon />
                                                </Button>
                                              </div>
                                          ) : (
                                              <p>-</p>
                                          )}
                                        </StyledTableCell>
                                      </StyledTableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() =>
                                      this.getMesasDetails(this.props.match.params.id)
                                  }
                              >
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
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Nombre</span>
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Precio</span>
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Cantidad</span>
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Typography className={useStyles.title}>
                                        <span>Total</span>
                                      </Typography>
                                    </StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {billActual.itemBill &&
                                  billActual.itemBill.map((row) => (
                                      <StyledTableRow key={row.id}>
                                        <StyledTableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                        >
                                          {row.itemMenu.name}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                        >
                                          {row.itemMenu.price} €
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="center"
                                            component="th"
                                            scope="row"
                                        >
                                          {row.amount}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                          {row.itemMenu.price * row.amount} €
                                        </StyledTableCell>
                                      </StyledTableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell align="right" colSpan={3}>
                                      <Typography
                                          className={useStyles.body}
                                          gutterBottom
                                      >
                                        <span>Total</span>
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                          className={useStyles.body}
                                          gutterBottom
                                      >
                                        <span> {total} € </span>
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              {!isAdmin && (
                                  <Grid container spacing={1}>
                                    <Grid item>
                                      <Button
                                          variant="contained"
                                          size="small"
                                          color="primary"
                                          disabled={!paymentSet || total === 0.}
                                          style={{ ...stylesComponent.buttonPayReview }}
                                          onClick={this.handleOpenPayment}
                                      >
                                        Pagar cuenta
                                      </Button>
                                    </Grid>
                                    <Grid item>
                                      <Button
                                          variant="contained"
                                          size="small"
                                          color="secondary"
                                          style={{ ...stylesComponent.buttonPayReview }}
                                          href={"/#/reviews/" + mesaActual.token}
                                      >
                                        Hacer una reseña
                                      </Button>
                                    </Grid>
                                  </Grid>
                              )}
                            </CardContent>
                          </Grid>
                        </Grid>
                    ) : (
                        <p></p>
                    )}
                  </div>
                </div>
            ) : (
                // Si no es vista de movil muestra la cabecera como siempre
                <Grid container justify="center">
                  <Grid item component={Card} xs={4}>
                    <CardContent>
                      <Typography
                          variant="h5"
                          className={useStyles.title}
                          gutterBottom
                      >
                        <span data-testid="tableId">{mesaActual.name}</span>
                      </Typography>
                      {mesaActual.free ? (
                          <img alt="Mesa Libre" src={mesaLibre} />
                      ) : (
                          <img alt="Mesa Ocupada" src={mesaOcupada} />
                      )}
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} xs={4}>
                    <CardContent>
                      {isAdmin && mesaActual.free ?(
                          <div>
                            <Typography
                                variant="h5"
                                className={useStyles.title}
                                gutterBottom
                            >
                              Código
                            </Typography>
                            <Typography
                                variant="h5"
                                className={useStyles.title}
                                gutterBottom
                            >
                              <span data-testid="tokenId">{mesaActual.token}</span>
                            </Typography>
                          </div>
                      ) : isAdmin && !mesaActual.free ? (
                              <Typography
                                  variant="h6"
                                  className={useStyles.title}
                                  gutterBottom
                              >
                                Comienza a gestionar esta mesa
                              </Typography>
                          ) :
                          <Typography
                              variant="h6"
                              className={useStyles.title}
                              gutterBottom
                          >
                            Bienvenido/a, {name}
                          </Typography>
                      }
                    </CardContent>
                    {isAdmin ? (
                        <CardActions>
                          {mesaActual.free ? (
                              <div align="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.changeStateToOcupated}
                                >
                                  Ocupar Manualmente
                                </Button>
                                <Button
                                    style={stylesComponent.buttonVolver}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.props.history.goBack()}
                                >
                                  Volver
                                </Button>
                              </div>
                          ) : (
                              <div align="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.handleOpen}
                                >
                                  Desocupar Manualmente
                                </Button>
                                <Button
                                    style={stylesComponent.buttonVolver}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.props.history.goBack()}
                                >
                                  Volver
                                </Button>
                              </div>
                          )}
                        </CardActions>
                    ) : (
                        <CardActions className={useStyles.buttonOcupar}>
                          {!mesaActual.free && (
                              <h4>
                                Ya tienes ocupada la mesa, ¡disfruta de tu estancia!
                              </h4>
                          )}
                        </CardActions>
                    )}
                  </Grid>

                  <Grid item component={Card} xs={4}>
                    <CardContent>
                      <Typography
                          variant="h5"
                          className={useStyles.title}
                          gutterBottom
                      >
                        Información
                      </Typography>
                      <Typography variant="h6" className={useStyles.pos}>
                        {mesaActual.free ? (
                            <p>
                              ESTADO: <span data-testid="freeId">Libre</span>
                            </p>
                        ) : (
                            <p>
                              ESTADO: <span data-testid="notFreeId">Ocupada</span>
                            </p>
                        )}
                      </Typography>
                      <Typography
                          variant="h6"
                          className={useStyles.title}
                          gutterBottom
                      >
                        ASIENTOS: {mesaActual.seats}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
            )}

            {/* Vista PARA IPAD Y SUPERIOR */}
            {/* <MediaQuery minWidth={768}> */}

            {/* </MediaQuery>         */}
            {!mesaActual.free && showMenuPhone ? (
                <Grid
                    container
                    spacing={0}
                    justify="center"
                    style={stylesComponent.gridBill}
                >
                  <Grid item component={Card} xs={12}>
                    <CardContent>
                      <Table size="small" aria-label="a dense table">
                        <caption>CARTA</caption>
                        <TableHead >
                          <TableRow>
                            <StyledTableCell align="center">
                              <Typography
                                  variant="h6"
                                  className={useStyles.title}
                                  gutterBottom
                              >
                                Nombre
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Typography
                                  variant="h6"
                                  className={useStyles.title}
                                  gutterBottom
                              >
                                Precio
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <Typography
                                  variant="h6"
                                  className={useStyles.title}
                                  gutterBottom
                              >
                                Cantidad
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Typography
                                  variant="h6"
                                  className={useStyles.title}
                                  gutterBottom
                              >
                                Añadir
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {menuActual.items &&
                          menuActual.items.map((row, index) => (
                              <StyledTableRow key={index}>
                                <StyledTableCell
                                    align="center"
                                    component="th"
                                    scope="row"
                                >
                                  {row.name}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.price} €
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  <TextField
                                      key={row.id}
                                      id={'filled-number' + index}
                                      label="Cantidad"
                                      style={{ ...stylesComponent.textField }}
                                      type="number"
                                      size="small"
                                      onKeyDown={(e) =>
                                          this.state.symbolsArr.includes(e.key) &&
                                          e.preventDefault()
                                      }
                                      onChange={(event) =>
                                          event.target.value < 1 ||
                                          event.target.value > 10000
                                              ? // eslint-disable-next-line
                                              (this.state.amountActual[index] = 0) ||
                                              (event.target.value = '')
                                              : // eslint-disable-next-line
                                              (this.state.amountActual[index] =
                                                  event.target.value)
                                      }
                                      value={this.state.amountActual[index]}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      variant="standard"
                                  />
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  <Button
                                      variant="contained"
                                      size="small"
                                      color="primary"
                                      style={{ ...stylesComponent.buttonAdd }}
                                      onClick={() => {
                                        if (
                                            this.state.amountActual[index] ===
                                            undefined ||
                                            this.state.amountActual[index] === '' ||
                                            this.state.amountActual[index] === 0
                                        ) {
                                          this.setState({
                                            showModalInputZero: true,
                                          });
                                        } else {
                                          this.addAmountToOrder(
                                              row.id,
                                              this.state.amountActual[index]
                                          );
                                        }
                                      }}
                                  >
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
            ) : (
                <p></p>
            )}
            {!mesaActual.free && !isPhoneScreen ? (
                <div>
                  <Grid container style={stylesComponent.gridBill}>
                    <Grid item component={Card} xs={12} lg={6} xl={6}>
                      <CardContent>
                        <Table size="small" aria-label="a dense table">
                          <caption>PRODUCTOS PEDIDOS PERO NO ENTREGADOS</caption>
                          <TableHead >
                            <TableRow>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Nombre
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Precio
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Cantidad
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Entregado
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Eliminar pedido
                                </Typography>
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {billActual.itemOrder &&
                            billActual.itemOrder.map((row) => (
                                <StyledTableRow key={row.id}>
                                  <StyledTableCell
                                      align="center"
                                      component="th"
                                      scope="row"
                                  >
                                    {row.itemMenu.name}
                                  </StyledTableCell>
                                  <StyledTableCell
                                      align="center"
                                      component="th"
                                      scope="row"
                                  >
                                    {row.itemMenu.price} €
                                  </StyledTableCell>
                                  <StyledTableCell
                                      align="center"
                                      component="th"
                                      scope="row"
                                  >
                                    {row.amount}
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    {isAdmin ? (
                                        <div>
                                          <Button
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              style={{ ...stylesComponent.buttonCrear }}
                                              onClick={() => this.addToBill(row.id)}
                                          >
                                            Entregado
                                          </Button>

                                          <Button
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              style={{
                                                ...stylesComponent.buttonCrear,
                                              }}
                                              onClick={() => this.addAllToBill(row.id)}
                                          >
                                            Entregar todo
                                          </Button>
                                        </div>
                                    ) : (
                                        <p>-</p>
                                    )}
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    {isAdmin ? (
                                        <div>
                                          <Button
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              style={{
                                                ...stylesComponent.buttonCrear,
                                              }}
                                              onClick={() => this.deleteBill(row.id)}
                                          >
                                            Eliminar
                                          </Button>
                                        </div>
                                    ) : (
                                        <p>-</p>
                                    )}
                                  </StyledTableCell>
                                </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                                this.getMesasDetails(this.props.match.params.id)
                            }
                        >
                          <span>Refrescar Comanda</span>
                        </Button>
                      </CardContent>
                    </Grid>
                    <Grid item component={Card} xs={12} lg={6} xl={6}>
                      <CardContent>
                        <Table size="small" aria-label="a dense table" color={"primary"}>
                          <caption>PRODUCTOS PEDIDOS Y ENTREGADOS</caption>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Nombre
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Precio
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Cantidad
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.title}
                                    gutterBottom
                                >
                                  Total
                                </Typography>
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {billActual.itemBill &&
                            billActual.itemBill.map((row) => (
                                <StyledTableRow key={row.id}>
                                  <StyledTableCell
                                      align="center"
                                      component="th"
                                      scope="row"
                                  >
                                    {row.itemMenu.name}
                                  </StyledTableCell>
                                  <StyledTableCell
                                      align="center"
                                      component="th"
                                      scope="row"
                                  >
                                    {row.itemMenu.price} €
                                  </StyledTableCell>
                                  <StyledTableCell
                                      align="center"
                                      component="th"
                                      scope="row"
                                  >
                                    {row.amount}
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    {row.itemMenu.price * row.amount} €
                                  </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            <TableRow>
                              <TableCell align="right" colSpan={3}>
                                <Typography
                                    variant="h6"
                                    className={useStyles.body}
                                    gutterBottom
                                >
                                  Total
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography
                                    variant="h6"
                                    className={useStyles.body}
                                    gutterBottom
                                >
                                  {' '}
                                  {total} €{' '}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        {!isAdmin && (
                            <Grid container spacing={1}>
                              <Grid item>
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    disabled={!paymentSet || total === 0.}
                                    style={{ ...stylesComponent.buttonPayReview }}
                                    onClick={this.handleOpenPayment}
                                >
                                  Pagar cuenta
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="secondary"
                                    style={{ ...stylesComponent.buttonPayReview }}
                                    href={"/#/reviews/" + mesaActual.token}
                                >
                                  Hacer una reseña
                                </Button>
                              </Grid>
                            </Grid>
                        )}
                      </CardContent>
                    </Grid>
                  </Grid>
                </div>
            ) : (
                <div></div>
            )}
            {openDialog ? (
                <Dialog
                    open={openDialog}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {'¿Seguro que quieres desocupar la mesa?'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Si lo haces, todos los datos relacionados con la cuenta de esta
                      mesa serán eliminados. Asegúrate de haber pagado.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="secondary">
                      Cancelar
                    </Button>
                    <Button
                        onClick={this.changeStateToFree}
                        color="primary"
                        autoFocus
                    >
                      Si
                    </Button>
                  </DialogActions>
                </Dialog>
            ) : (
                <p></p>
            )}
            <Dialog
                open={openPaymentDialog}
                data-testid={"pay-dialog"}
                fullScreen={isPhoneScreen}
                onClose={() => this.handleClosePayment(false)}
                aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Pago de la cuenta</DialogTitle>
              <DialogContent>
                <BillCheckout amount={total} onCloseDialog={this.handleClosePayment} table={mesaActual.id}/>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.handleClosePayment(false)} color="primary">
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar open={successReview} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
              <Alert onClose={this.handleSnackbarClose} severity="success">
                Las reseñas se han publicado correctamente
              </Alert>
            </Snackbar>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
              <Alert onClose={this.handleSnackbarClose} severity="success">
                El pago se ha realizado correctamente
              </Alert>
            </Snackbar>
          </div>
        </div>
    ) : (
        <div>
          <Redirect to="/pageNotFound"></Redirect>
        </div>
    );
  }
}