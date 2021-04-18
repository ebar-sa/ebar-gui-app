import React, { Component } from 'react'
import MenuDataService from '../services/menu.service'
import {withStyles, makeStyles } from '@material-ui/core/styles'
import {Typography, CardContent, Grid, Card} from '@material-ui/core'
import {TableRow, Table, TableBody, TableHead, TableCell} from '@material-ui/core'
import Button from "@material-ui/core/Button"
import * as AuthService from '../services/auth'
import Alert from '@material-ui/lab/Alert'
import {Snackbar} from "@material-ui/core"
import Paper from "@material-ui/core/Paper/Paper"

export default class Menu extends Component {    

    constructor(props) {
        super(props);
        this.getMenuDetails = this.getMenuDetails.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.isLogged = this.isLogged.bind(this);
        this.state = {
            menuActual : {
                id: null,
                items : []
            },
            idBar : this.props.match.params.idBar,
            isAdmin : false,
            alerta : false
        };
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.setState({
          idBar : this.props.match.params.idBar
        })
        this.getMenuDetails(this.props.match.params.idBar);
        this.isLogged();
    }

    isLogged(){
      const user = AuthService.getCurrentUser()
      if(user!=null){
        user.roles.forEach((rol) => {
        if(rol === 'ROLE_OWNER' || rol === 'ROLE_EMPLOYEE'){
          this.setState({
            isAdmin : true
          })
        }
      })
      }
    }

    handleClose(){
      this.setState({
        alerta: false
      })
    }

    getMenuDetails(idBar) {
        MenuDataService.getMenu(idBar).then(res => {
            this.setState({
                menuActual : res.data
            })
            console.log(res.data);
        })
        .catch(e => {
            console.log(e)
        })
    }

    deleteItem(idBar, idItemMenu) {
      MenuDataService.deleteItem(idBar, idItemMenu).then(response => {
        if(response.status === 200) {
          this.props.history.go(0)
        }
      }).catch(error => {
        this.setState({
          alerta: true
        })
        console.log("Error " + error)
      })
    }

    render() {
        const useStyles = makeStyles({
            card: {
              margin: 16,
              display: "grid",
              flexDirection: "column",
              maxWidth: 100,
              justifyContent: "space-between"
            },
            title: {
              fontSize: 16,
            },
            botton: {
              fontSize: 16,
            },
            cardAction: {
              width: '100%',
            },
            nombreItem: { 
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
          })
        
        const {menuActual, idBar, isAdmin, alerta} = this.state
        
        const StyledTableRow = withStyles((theme) => ({
            root: {
              '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          }))(TableRow);

        const stylesComponent = {
          buttonCreate: {
              backgroundColor: '#007bff',
              textTransform: 'none',
              letterSpacing: 'normal',
              fontSize: '15px',
              fontWeight: '600',
              textAlign: 'center'
          },
          buttonDelete: {
            backgroundColor: '#FF0000',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center'
          },
            buttonBack: {
              backgroundColor: '#000495',
              textTransform: 'none',
              letterSpacing: 'normal',
              fontSize: '15px',
              fontWeight: '600',
              textAlign: 'center'
            }
        }
        
        const StyledTableCell = withStyles((theme) => ({
          head: {
            backgroundColor: '#2A5DBC',
            color: theme.palette.common.white,
          },
          body: {
            fontSize: 14,
          },
        }))(TableCell);

        const logo = require('../img/no-image.png');

        return (
            <div style = {{"marginBottom": "45px"}}>
                <Grid container spacing={0} justify="center" style={{"display": "grid"}} >
                  <Grid item component={Card} xs>
                    <CardContent>
                      <Snackbar  open={alerta} autoHideDuration={6000} onClose={this.handleClose}>
                        <Alert onClose={this.handleClose} severity="error">
                          No se puede borrar el item hasta que no se encuentre en ninguna cuenta.
                        </Alert>
                      </Snackbar>
                      <Typography variant="h5" align = "center" className={useStyles.title} gutterBottom> 
                            MENÚ
                      </Typography>

                      <div style={{"textAlign":"center"}}>
                        {isAdmin ?
                          <Button variant="contained" color="primary" style={{ ...stylesComponent.buttonCreate }} href={`/#/bares/${idBar}/menu/itemMenu`}>Crear</Button>
                          :
                        <div></div>
                        }
                        </div>
                    </CardContent>
                    <CardContent>
                      <Paper style={{ overflowX: "auto" }}>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow >
                              <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Categoria</Typography></StyledTableCell>
                              <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
                              <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Descripción</Typography></StyledTableCell>
                              <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>
                              <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
                              <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Ver Imagen</Typography></StyledTableCell>
                              {isAdmin ?
                              <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Acciones</Typography></StyledTableCell>
                                :
                                <p></p>
                              }
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {menuActual.items && menuActual.items.map((row) => (
                              <StyledTableRow key={row.name}>
                                <StyledTableCell>{row.category}</StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                  <span data-testid="nombreItem"> {row.name} </span>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <span data-testid="descriptionItem">{row.description}</span>
                                </StyledTableCell>
                                <StyledTableCell >
                                  <span data-testid="rationTypeItem">{row.rationType}</span>
                                </StyledTableCell>
                                <StyledTableCell >
                                  <span data-testid="priceItem">{row.price} €</span>
                                </StyledTableCell>
                                <Grid item xs={5} sm={5} align="center">
                                  <StyledTableCell>{(row.image != null) ? <img alt="" src={"data:" + row.image.type + ";base64," + row.image.data} 
                                    style={{"width": "100px",
                                      "height": "100px"}}/> :
                                    <img alt="" src={logo.default} 
                                      style={{"width": "100px",
                                        "height": "100px"}}/>}
                                  </StyledTableCell>
                                </Grid>
                                {isAdmin ?
                                <StyledTableCell>
                                  <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonCreate }} href={`/#/bares/${idBar}/menu/itemMenu/${row.id}`}>Editar</Button>
                                  <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonDelete }} onClick={() => this.deleteItem(idBar, row.id)}>Borrar</Button>
                                </StyledTableCell>
                                :
                                <p></p>  
                              }
                              </StyledTableRow>
                            ))}
                          </TableBody> 
                        </Table>
                      </Paper>
                    </CardContent>
                    <CardContent>
                      <div style={{"textAlign":"center"}}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ ...stylesComponent.buttonBack}}
                            onClick={() => this.props.history.goBack()}>
                            Volver
                        </Button>
                      </div>
                    </CardContent>
                  </Grid>
                </Grid>
            </div>
        );

    }

}