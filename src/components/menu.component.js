import React, { Component } from 'react';
import MenuDataService from '../services/menu.service';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  CardContent,
  Card,
  Snackbar,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as AuthService from '../services/auth';
import Alert from '@material-ui/lab/Alert';
import BarDataService from '../services/bar.service';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Rating from '@material-ui/lab/Rating';
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Pagination from "@material-ui/lab/Pagination";
import Container from "@material-ui/core/Container";

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
    this.handleSuccessfulDelete = this.handleSuccessfulDelete.bind(this);
    this.handleOpenReviews = this.handleOpenReviews.bind(this);
    this.getShownReviews = this.getShownReviews.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.anonymizeName = this.anonymizeName.bind(this);
    this.state = {
      mapa: {},
      idBar: this.props.match.params.idBar,
      isAdmin: false,
      alerta: false,
      showModal: false,
      showReviews: false,
      shownReviews: [],
      totalPages: 1,
      currentPage: 1,
      item: '',
      phoneScreen: false,
    };
    this.pageLength = 5
  }



  componentDidMount() {
    this.setState({
      idBar: this.props.match.params.idBar,
    });
    this.getMenuDetails(this.props.match.params.idBar);
    this.isLogged();
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  isLogged() {
    const username = AuthService.getCurrentUser().username;
    BarDataService.getBar(this.state.idBar)
      .then((res) => {
        let owner = res.data.owner;
        let emp = res.data.employees.map((a) => a.username);
        if (owner === username || emp.includes(username)) {
          this.setState({
            isAdmin: true,
          });
        }
      })
      .catch((err) => {
        this.props.history.push('/pageNotFound/');
      });
  }

  handleClose() {
    this.setState({
      alerta: false,
    });
  }

  handleShowModal(row) {
    this.setState({
      showModal: true,
      item: row,
      shownReviews: this.getShownReviews(row.reviews, 1),
      totalPages: Math.ceil(row.reviews.length/this.pageLength)
    });
  }

  handleCloseModal() {
    this.setState({
      showModal: false,
      showReviews: false
    });
  }

  getMenuDetails(idBar) {
    MenuDataService.getMenu(idBar)
      .then((res) => {
        this.setState({
          mapa: res.data,
        });
        console.log(res.data);
      })
      .catch(e => {
        console.log(e)
      })
  }

  handleSuccessfulDelete = (response) => {
    if (response.status === 200) {
      this.props.history.go(0);
    }
  }

  deleteItem(idBar, idItemMenu) {
    MenuDataService.deleteItem(idBar, idItemMenu)
      .then((response) => {
        this.handleSuccessfulDelete(response)
      })
      .catch((error) => {
        this.setState({
          alerta: true,
        });
        console.log('Error ' + error);
      });
  }

  deleteImage(idBar, idItemMenu) {
    MenuDataService.deleteImage(idBar, idItemMenu)
      .then((response) => {
        this.handleSuccessfulDelete(response)
      })
      .catch((error) => {
        this.props.history.push('/pageNotFound/');
        console.log('Error ' + error);
      });
  }

  handleOpenReviews() {
    this.setState({
      showModal: false,
      showReviews: true
    });
  }

  getShownReviews = (reviews, page) => {
    let toBeShown = []
    for (let i = page * this.pageLength - this.pageLength; i < page * this.pageLength; i++) {
      if (reviews.length <= i) {
        break
      }
      toBeShown.push(reviews[i])
    }

    return toBeShown
  }

  handlePageChange = (event, value) => {
    this.setState({
      currentPage: value,
      shownReviews: this.getShownReviews(this.state.item.reviews, value)
    });
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (window.innerWidth < 768) {
      this.setState({
        phoneScreen: true,
      });
    } else {
      this.setState({
        phoneScreen: false,
      });
    }
  }

  anonymizeName(username) {
    return username.charAt(0) + "*".repeat(username.length - 2) + username.charAt(username.length - 1);
  }

  render() {
    const useStyles = makeStyles({
      title: {
        fontSize: '10vw',
      },
    });

    const { mapa, idBar, isAdmin, alerta, showModal, item, showReviews, shownReviews, totalPages, currentPage, phoneScreen } = this.state;

    const StyledTableRow = withStyles((theme) => ({
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
        },
        '&:nth-of-type(even)': {
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
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
        textAlign: 'center',
      },
      buttonDelete: {
        color: '#FF0000',
      },
      buttonDeleteImage: {
        color: '#FF0000',
        display: 'contents',
      },
      buttonBack: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
      },
      block: {

      }
    };

    const StyledTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: '#006e85',
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 12,
        padding: '6px 10px 6px 0px',
        display: 'flex',
        alignItems: 'center',
      },
    }))(TableCell);

    const StyledTableCellFlex = withStyles((theme) => ({
      head: {
        backgroundColor: '#006e85',
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 12,
        padding: '6px 10px 6px 0px',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
      },
    }))(TableCell);

    const logo = require('../img/no-image.png');

    return (
      <>
        <Container style={{ marginBottom: '100px' }}>
          <Typography variant="h3" align="center" style={{ margin: '30px 0' }}>
            Carta
          </Typography>
          <Card style={{ margin: 'auto', maxWidth: 700 }}>
            <CardContent>
              <Snackbar
                open={alerta}
                autoHideDuration={6000}
                onClose={this.handleClose}
              >
                <Alert onClose={this.handleClose} severity="error">
                  No se puede borrar el item hasta que no se encuentre en
                  ninguna cuenta.
                </Alert>
              </Snackbar>
            </CardContent>
            <CardContent>
              <Table
                size="medium"
                aria-label="a dense table"
                style={{ textAlign: 'center', overfloxX: 'auto' }}
              >
                <TableBody>
                  {Object.keys(mapa).length === 0 && (
                    <div style={{ textAlign: '-webkit-center' }}>
                      <h2>La carta está vacía</h2>
                    </div>
                  )}
                  {Object.keys(mapa).map((category) => (
                      <Grid container spacing={1} justify={"center"} alignItems={"center"} alignContent={"center"}>
                        <Grid item xs={12} align={"center"}>
                         <h2>{category}</h2>
                        </Grid>
                      {mapa[category].map((row) => (
                          <Grid item xs={12} align={"center"}>
                            <StyledTableRow>
                              <StyledTableCell>
                                {row.image != null ? (
                                  <img
                                    alt=""
                                    src={
                                      'data:' +
                                      row.image.type +
                                      ';base64,' +
                                      row.image.data
                                    }
                                    style={{
                                      width: '85px',
                                      height: '85px',
                                    }}
                                  />
                                ) : (
                                  <img
                                    alt=""
                                    src={logo.default}
                                    style={{
                                      width: '85px',
                                      height: '85px',
                                    }}
                                  />
                                )}
                                {isAdmin && row.image != null ? (
                                  <IconButton
                                    variant="contained"
                                    size="small"
                                    style={{ ...stylesComponent.buttonDeleteImage }}
                                    onClick={() => this.deleteImage(idBar, row.id)}
                                  >
                                    <HighlightOffIcon />
                                  </IconButton>
                                ) : null}
                              </StyledTableCell>
                              <StyledTableCellFlex>
                                <Button
                                  data-testid="nombreItem"
                                  type="button"
                                  onClick={() => this.handleShowModal(row)}
                                >
                                  {row.name}
                                </Button>
                              </StyledTableCellFlex>
                              <StyledTableCell>
                                <span data-testid="priceItem">{row.price} €</span>
                              </StyledTableCell>
                              {isAdmin ? (
                                <StyledTableCell>
                                  <IconButton
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    href={`/#/bares/${idBar}/menu/itemMenu/${row.id}`}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    variant="contained"
                                    size="small"
                                    style={{ ...stylesComponent.buttonDelete }}
                                    onClick={() => this.deleteItem(idBar, row.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </StyledTableCell>
                              ) : null}
                            </StyledTableRow>
                          </Grid>
                      ))}
                    </Grid>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardContent>
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ ...stylesComponent.buttonBack }}
                  onClick={() => this.props.history.goBack()}
                >
                  Volver
                </Button>
                {isAdmin && (
                  <Button
                    style={{ marginLeft: 5 }}
                    variant="contained"
                    color="primary"
                    href={`/#/bares/${idBar}/menu/itemMenu`}
                    startIcon={<AddIcon />}
                  >
                    Añadir
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Dialog
            open={showModal}
            onClose={this.handleCloseModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle align="center" id="alert-dialog-title">
              {item?.name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText align="center" id="alert-dialog-description">
                <Grid container spacing={1} justify={"center"}>
                  <Grid item xs={12}>
                    {item?.image != null ? (
                      <img
                        alt=""
                        src={
                          'data:' + item?.image.type + ';base64,' + item?.image.data
                        }
                        style={{
                          width: '100px',
                          height: '100px',
                        }}
                      />
                    ) : (
                      <img
                        alt=""
                        src={logo.default}
                        style={{
                          width: '100px',
                          height: '100px',
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1} alignContent={"center"} alignItems={"flex-start"} justify={"center"}>
                      <Grid item>
                        <Rating value={item?.avgRating} precision={0.1} readOnly />
                      </Grid>
                      <Grid item>
                        <Typography>{" (" + item.reviews?.length + ")"}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      className={useStyles.title}
                      gutterBottom
                    >
                      Categoría: {item?.category}
                    </Typography>
                  </Grid>
                {item.description != null ? (
                    <Grid item xs={12}>
                      <Typography
                        variant="h5"
                        className={useStyles.title}
                        gutterBottom
                      >
                        Descripción: {item?.description}
                      </Typography>
                    </Grid>
                ) : null}
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      className={useStyles.title}
                      gutterBottom
                    >
                      Cantidad: {item?.rationType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      className={useStyles.title}
                      gutterBottom
                    >
                      Precio: {item?.price} €
                    </Typography>
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleOpenReviews} color="secondary">
                Mostrar reseñas
              </Button>
              <Button onClick={this.handleCloseModal} color="secondary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
              open={showReviews}
              fullScreen={phoneScreen}
              onClose={this.handleCloseModal}
              aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id={'responsive-dialog-title'}>
              Reseñas del ítem
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Grid container justify={"center"}>
                  {shownReviews && shownReviews.length > 0?
                  <List>
                    {shownReviews.map((review, idx) => (
                        <Grid item xs={12}>
                          <ListItem alignItems={"flex-start"}>
                            <ListItemText
                                primary={<Rating value={review.value} precision={0.5} readOnly />}
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary">
                                      {review.description? review.description : ""}
                                    </Typography>
                                    {(review.description? " - " : "") + "Realizada por " + this.anonymizeName(review.creator.username)}
                                  </React.Fragment>
                                }/>
                          </ListItem>
                          <Divider />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                      <ListItem style={{display:'flex', justifyContent:'center'}}>
                        <Pagination count={totalPages} page={currentPage} onChange={this.handlePageChange} />
                      </ListItem>
                    </Grid>
                  </List>
                  :
                  <Typography>
                    No hay reseñas para este ítem
                  </Typography>}
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleCloseModal} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </>
    );
  }
}
