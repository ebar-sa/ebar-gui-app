import React, { Component } from 'react';
import MenuDataService from '../../../src/services/menu.service';
import {withStyles, makeStyles } from '@material-ui/core/styles'
import {Typography, CardContent, Grid, Card} from '@material-ui/core';
import {TableRow, Table, TableBody, TableHead, TableCell} from '@material-ui/core';
import Button from "@material-ui/core/Button";


export default class Menu extends Component {
    
    constructor(props) {
        super(props);
        this.getMenuDetails = this.getMenuDetails.bind(this);
        this.isLogged = this.isLogged.bind(this);
        this.state = {
            menuActual : {
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

    isLogged() {
        if(localStorage.getItem('user')) {
            this.setState({ isLogged: true})
        } else {
            this.setState({ isLogged: false})
        }
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

        const {menuActual} = this.state
        
        const StyledTableRow = withStyles((theme) => ({
            root: {
              '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          }))(TableRow);

          const stylesComponent = {
            buttonAñadir: {
                backgroundColor: '#007bff',
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

        const logo = require('../../img/no-image.png');

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
                    <StyledTableCell><Typography variant="h5"className={useStyles.title} gutterBottom>Ver Imagen</Typography></StyledTableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuActual.items && menuActual.items.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell align="left">{row.category.name}</StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.description}</StyledTableCell>
                      <StyledTableCell align="left">{row.rationType}</StyledTableCell>
                      <StyledTableCell align="left">{row.price}</StyledTableCell>
                      <Grid item xs={5} sm={5} align="center">
                      <StyledTableCell align="left">{(row.image != null) ? <img alt="" src={"data:" + row.image.type + ";base64," + row.image.data} 
                          style={{"width": "120px"},
                            {"height": "120px"}}/> :
                        <img alt="" src={logo.default} 
                          style={{"width": "120px"},
                            {"height": "120px"}}/>}</StyledTableCell>
                      </Grid>
                    </StyledTableRow>
                  ))}
                </TableBody> 
                </Table>
                </CardContent>
                <div style={{"text-align":"center"}}>
                  <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} href={`/`}>Volver</Button>
                </div>
                </Grid>
                </Grid>
                
            </div>
        );

    }

}