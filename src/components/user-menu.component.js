import React, { Component } from 'react';
import { Typography, CardContent, Grid,Card } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import MenuDataService from '../services/menu.service';
import BillDataService from '../services/bill.service';
import {TableRow, Table, TableBody, TableHead, TableCell
} from '@material-ui/core';

export default class UserMenuDetails extends Component {
  constructor(props) {
    super(props)
    this.getBarMenu = this.getBarMenu.bind(this);

    this.state = {
       menuActual : {
        id : null,
        items: []
      },
       isLogged:false
    };
    
  };
  
  componentDidMount() {
    console.log(this.props.match.params.id); 
    this.getBarMenu(this.props.match.params.id);
  } 

  getBarMenu(id){
    MenuDataService.getBarMenu(id).then(res => { 
      this.setState({
        menuActual : res.data
      })
      console.log(res.data);
    })
    .catch(e => {
    console.log(e);
    })
  }

  addToOrder(idItem) {
    const idBill = this.state.billActual.id;
    console.log(idItem);
    BillDataService.addToOrder(idBill, idItem).then(res => { 
      this.setState({  
        billActual:res.data
      })
      console.log(res.data)
    }).catch(e =>{
      console.log(e);
    })
  }

  addToOrderUser() {
    const idBill = this.props.match.params.id;
    BillDataService.addToOrder(idBill, idBill, idBill).then(res => { 
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
    

        const {menuActual} = this.state
      
        return (
        <div>
            <Grid container spacing={0} justify="center">
            <Grid item component={Card} xs>
        <CardContent>
        <Typography align="center" variant="h6"className={useStyles.title} gutterBottom>CARTA</Typography>
        <Table size="small" aria-label="a dense table">
        
        <TableHead>
          <TableRow >
          
            <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Nombre</Typography></StyledTableCell>
            <StyledTableCell align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Precio</Typography></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuActual.items && menuActual.items.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.price} €</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody> 
        </Table>
        </CardContent>
        </Grid>
            </Grid>
            
        </div>
    );
    }
}