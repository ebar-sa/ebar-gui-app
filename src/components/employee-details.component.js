import React, { Component } from 'react';

import { Typography, Grid,Card, CardContent, TableRow, Table, TableBody, TableHead, TableCell, Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import EmployeeDataService from '../services/employee.service';


export default class EmployeeDetails extends Component {
  constructor(props) {
    super(props)
    this.getEmployeeByUsername = this.getEmplByUsername.bind(this);

    this.state = {
        idBarActual : null,
        employeeActual: {
            username : "",
            firstName: "",
            lastName: "", 
            dni: "",
            email: "",
            phoneNumber: "",
            password: "",
            roles: []
          },
    };
    
  };
  
  componentDidMount() {
    console.log(this.props.match.params.idBar, this.props.match.params.username); 
    this.getEmplByUsername(this.props.match.params.idBar, this.props.match.params.username);
  } 

  getEmplByUsername(idBar, username){
    EmployeeDataService.getEmployeeByUsername(idBar, username).then(res => { 
      this.setState({
        employeeActual : res.data,
        idBarActual : idBar
        
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
          root: {
            padding: '5rem',
          },
        })
        
    
        const StyledTableCell = withStyles((theme) => ({
          head: {
            backgroundColor: '#2A5DBC',
            color: theme.palette.common.white,
          },
          body: {
            fontSize: 20,
          },
        }))(TableCell);
      
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
              fontSize: '20px',
              fontWeight: '600'
          }
        }

        const {employeeActual, idBarActual} = this.state
        

        return (
            
        <div className={useStyles.root}>
        <Grid item component={Card} xs>
            <CardContent>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow >
                    <StyledTableCell colSpan={2} align="center"><Typography variant="h6"className={useStyles.title} gutterBottom>Detalles del empleado</Typography></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <StyledTableRow>
                      <StyledTableCell align="center" component="th" scope="row">
                        Nombre de usuario: 
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {employeeActual.username}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell align="center" component="th" scope="row">
                        Nombre y apellidos: 
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {employeeActual.firstName}  {employeeActual.lastName}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell align="center" component="th" scope="row">
                        Email: 
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {employeeActual.email}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell align="center" component="th" scope="row">
                        DNI: 
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {employeeActual.dni}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell align="center" component="th" scope="row">
                        Teléfono: 
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {employeeActual.phoneNumber}
                      </StyledTableCell>
                    </StyledTableRow>
                </TableBody> 
              </Table>
            </CardContent>
        </Grid>
        <div style={{"textAlign":"center"}}>
          <Button align= "center "variant="contained" size='big' color="primary" style={{ ...stylesComponent.buttonAñadir }} href={`#/bar/${idBarActual}/employees`}>Volver</Button>
          </div>
        </div>
        )
    }
}


