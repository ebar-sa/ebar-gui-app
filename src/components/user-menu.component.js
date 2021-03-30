import React, { Component } from 'react';
import { Typography, CardContent, Grid, CardActions,Card,Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import MenuDataService from '../services/menu.service';
import BillDataService from '../services/bill.service';
import {TableRow, Table, TableBody, TableHead, TableCell
} from '@material-ui/core';
  import { SettingsRemoteRounded, Title } from '@material-ui/icons';

export default class UserMenuDetails extends Component {
  constructor(props) {
    super(props)
    this.isLogged = this.isLogged.bind(this);
    this.getMenu = this.getMenu.bind(this);

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
    this.isLogged();
    this.getMenu(this.props.match.params.id);
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

  addToOrderUser() {
    const idBill = this.props.match.params.id;
    //const idItem = this.props.match.params.id;
    //const amount = this.props.match.params.amount;
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
    

        const {menuActual, isLogged} = this.state
      
        return (
        <div>
            <Grid container spacing={0} justify="center">
            <Grid item component={Card} xs>
            <CardContent>
            <Typography variant="h5" align = "center"  className={useStyles.title} gutterBottom> 
                  MENÚ
                </Typography> 
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
            </Grid>
            
        </div>
    );
    }
}