import React, { Component } from 'react';
import MenuDataService from '../services/menu.service';
import {withStyles, makeStyles } from '@material-ui/core/styles'
import {Typography, CardContent, Grid, Card} from '@material-ui/core';
import {TableRow, Table, TableBody, TableHead, TableCell} from '@material-ui/core';

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.getMenuDetails = this.getMenuDetails.bind(this);
        this.isLogged = this.isLogged.bind(this);
        this.state = {
            menu : {
                id: null,
                items : []
            }, 
            isLogged : false
        };
    };

    componentDidMount() {
        console.log(this.props.match.params.idBar);
        this.getMenuDetails(this.props.match.params.idBar);
        this.isLogged();
    }

    isLogged() {
        if(localStorage.getItem('user')) {
            this.setState({ isLogged: true})
        } else {
            this.setState({ isLogged: false})
        }
    }

    // Duda
    getMenuDetails(idBar) {
        MenuDataService.getMenu(idBar).then(res => {
            this.setState({
                menu : res.data
            })
            console.log(res.data);
        })
        .catch(e => {
            console.log(e)
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

        const {menu,isLogged} = this.state
        
        const StyledTableRow = withStyles((theme) => ({
            root: {
              '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          }))(TableRow);
        
        
        const StyledTableCell = withStyles((theme) => ({
          head: {
            backgroundColor: '#2A5DBC',
            color: theme.palette.common.white,
          },
          body: {
            fontSize: 14,
          },
        }))(TableCell);

        

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
                    <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Descripción</Typography></StyledTableCell>
                    <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Categoria</Typography></StyledTableCell>
                    <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Cantidad</Typography></StyledTableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {menu.items && menu.items.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.price}</StyledTableCell>
                      <StyledTableCell align="left">{row.description}</StyledTableCell>
                      <StyledTableCell align="left">{row.id_categoria.name}</StyledTableCell>
                      <StyledTableCell align="left">{row.ration_type}</StyledTableCell>
                    
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