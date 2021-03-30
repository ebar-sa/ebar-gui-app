import React, { Component } from 'react';
import MesaDataService from '../services/mesa.service';
import { Typography, CardContent, Grid, CardActions,Card,Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import mesaLibre from '../static/images/table/mesaLibre.png'
import mesaOcupada from '../static/images/table/mesaOcupada.png'
import MenuDataService from '../services/menu.service';
import {TableRow, Table, TableBody, TableHead, TableCell
} from '@material-ui/core';
import BillDataService from '../services/bill.service';
  import { SettingsRemoteRounded } from '@material-ui/icons';

export default class BarTableDetails extends Component {
  constructor(props) {
    super(props)
    this.getMesasDetails = this.getMesasDetails.bind(this);
    this.changeStateToFree = this.changeStateToFree.bind(this);
    this.changeStateToOcupated = this.changeStateToOcupated.bind(this);
    this.isLogged = this.isLogged.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.getBill = this.getBill.bind(this);

    this.state = {
       mesaActual : {
           id : null,
           nombre: "",
           token: "", 
           estadoMesa: "",
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
       isLogged:false
    };
    
  };
  
  componentDidMount() {
    console.log(this.props.match.params.id); 
    this.getMesasDetails(this.props.match.params.id);
    this.isLogged();
    this.getMenu(this.props.match.params.id);
    this.getBill(this.props.match.params.id);
  } 
  isLogged(){
    if(localStorage.getItem('user')){
      this.setState({
        isLogged : true
      })
    }else { 
      this.setState({
        isLogged:false
      })
    }
  }

  getMesasDetails(id) {
      MesaDataService.getBarTable(id).then(res => { 
          this.setState({
              mesaActual : res.data
          })
          console.log(res.data);
      })
      .catch(e => {
          console.log(e);
      })
  }

  getMenu(id){
    MenuDataService.getMenu(id).then(res => { 
      this.setState({
        menuActual : res.data
      })
      console.log(res.data);
    })
    .catch(e => {
    console.log(e);
    })
  }

  getBill(id){
    BillDataService.getBill(id).then(res => { 
      this.setState({
        billActual : res.data
      })
      console.log(res.data);
    })
    .catch(e => {
    console.log(e);
    })
  }

  changeStateToFree() {
    const id = this.props.match.params.id;
    MesaDataService.updateBarTableStateToFree(id).then(res => { 
      this.setState({  
        mesaActual:res.data
      })
      console.log(res.data)
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
      console.log(res.data)
    }).catch(e =>{
      console.log(e);
    })
  }

  addToOrder() {
    const idBill = this.props.match.params.id;
    //const idItem = this.props.match.params.id;
    BillDataService.addToOrder(idBill, idBill).then(res => { 
      this.setState({  
        billActual:res.data
      })
      console.log(res.data)
    }).catch(e =>{
      console.log(e);
    })
  }



    render() {
        const useStyles = makeStyles({
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
          botton: {
            fontSize: 16,

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
        })

        const stylesComponent = {

          buttonAñadir: {
              backgroundColor: '#007bff',
              textTransform: 'none',
              letterSpacing: 'normal',
              fontSize: '15px',
              fontWeight: '600'
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
      
      const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }))(TableRow);
    

        const {mesaActual, menuActual, billActual, isLogged} = this.state
      
    return (
      <div>
        <div>
          <Grid container spacing={0} justify="center" >
            <Grid item component={Card} xs>
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom>
                  {mesaActual.name}
                </Typography>
                {mesaActual.free ? 
                <img alt="Mesa Libre" src={mesaLibre} />
                : 
                <img alt="Mesa Ocupada" src={mesaOcupada} />
                }
              </CardContent>
            </Grid>

            <Grid item component={Card} xs>
              <CardContent>
                <Typography variant="h5"className={useStyles.title} gutterBottom> 
                  Código
                </Typography> 
                <Typography variant="h4" component="h2">
                   {mesaActual.token}
                </Typography>
              </CardContent>
              <CardActions>
                {mesaActual.free ? 
                <Button variant="contained" color="primary" onClick = {this.changeStateToOcupated}>
                    Ocupar Manualmente
                </Button>
                :
                <Button variant="contained" color="secondary" onClick = {this.changeStateToFree}>
                    Desocupar Manualmente
                </Button>
                }
              </CardActions>
            </Grid>

            <Grid item component={Card} xs>
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom> 
                  Informacion
                </Typography> 
                <Typography variant="h6" className={useStyles.pos}>
                   
                  {mesaActual.free ? 
                      <p>ESTADO: Libre</p> 
                      :
                      <p>ESTADO: Ocupada</p> 
                  } 
                </Typography>
                <Typography variant="h6" className={useStyles.title} gutterBottom> 
                    ASIENTOS: {mesaActual.seats}
                </Typography>  
              </CardContent>
            </Grid>
          </Grid>
        </div>

        <div>
        <Grid container spacing={0} justify="center">
        <Grid item component={Card} xs>
        <CardContent>
        
        <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow >
          
            <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
            <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
            <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Añadir</Typography></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuActual.items && menuActual.items.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.price}</StyledTableCell>
              <StyledTableCell align="left">
              <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} onClick = {this.addToOrder} >
                                        Añadir
                                    </Button>
                                    </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody> 
        </Table>
        </CardContent>
        </Grid>
        
        
        
        <Grid item component={Card} xs>
        <CardContent>
         <Table size="small" aria-label="a dense table">
         <caption>PRODUCTOS PEDIDOS PERO NO ENTREGADOS</caption>
          <TableHead>
           <TableRow>
            <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
             <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
             <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {billActual.itemOrder && billActual.itemOrder.map((row) => (
           <StyledTableRow key={row.amount}>
             <StyledTableCell component="th" scope="row">
                 {row.itemMenu.name}
               </StyledTableCell>
               <StyledTableCell component="th" scope="row">
                 {row.itemMenu.price}
               </StyledTableCell>
               <StyledTableCell component="th" scope="row">
                 {row.amount}
               </StyledTableCell>

            </StyledTableRow>
         ))}
       </TableBody> 
         </Table>

         </CardContent>
        </Grid>

        
        <Grid item component={Card} xs>
        <CardContent>
            
         <Table size="small" aria-label="a dense table">
         <caption>PRODUCTOS PEDIDOS Y ENTREGADOS</caption>
         <TableHead>
           <TableRow>
             <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
             <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
             <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>
             <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Total</Typography></StyledTableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {billActual.itemBill && billActual.itemBill.map((row) => (
            <StyledTableRow key={row.amount}>
             <StyledTableCell component="th" scope="row">
                 {row.itemMenu.name}
               </StyledTableCell>
               <StyledTableCell component="th" scope="row">
                 {row.itemMenu.price}
               </StyledTableCell>
               <StyledTableCell component="th" scope="row">
                 {row.amount}
               </StyledTableCell>
             <StyledTableCell align="left">{row.itemMenu.price*row.amount}</StyledTableCell>

            </StyledTableRow>
               ))}
               </TableBody>
               </Table>
               </CardContent>
               </Grid>
        </Grid>
               </div>
        </div>
    );
  }
}