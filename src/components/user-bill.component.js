import React, { Component } from 'react';
import { Typography, CardContent, Grid, CardActions,Card,Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import BillDataService from '../services/bill.service';
import {TableRow, Table, TableBody, TableHead, TableCell
} from '@material-ui/core';
  import { SettingsRemoteRounded } from '@material-ui/icons';

  const TAX_RATE = 0.07;

export default class UserBillDetails extends Component {
  constructor(props) {
    super(props)
    this.isLogged = this.isLogged.bind(this);
    this.getBill = this.getBill.bind(this);

    this.state = {
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
    this.isLogged();
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
      }))(TableCell);
      
      const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }))(TableRow);
    

        const {billActual, isLogged} = this.state
      
        return (
        <div>
           <Grid container spacing={0} justify="center">
           <Grid item component={Card} xs>
        <CardContent>

        <Typography variant="h6"className={useStyles.title} gutterBottom>PRODUCTOS PEDIDOS Y ENTREGADOS</Typography>  
         <Table size="small" aria-label="a dense table">
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
            <StyledTableRow key={row.amount}>
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
        </div>
    );
    }
}