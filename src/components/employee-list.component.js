import React, { Component } from 'react';

import { Typography, CardContent, Grid, Card, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import EmployeeDataService from '../services/employee.service';
import { ButtonBase } from '@material-ui/core'


export default class EmployeeList extends Component {
  constructor(props) {
    super(props)
    this.getEmployees = this.getEmployees.bind(this);

    this.state = {
        idBarActual : null,
        employees: []
    };
    
  }
  
  componentDidMount() {
    console.log(this.props.match.params.idBar); 
    this.getEmployees(this.props.match.params.idBar);
  } 

  getEmployees(idBar){
    EmployeeDataService.getEmployees(idBar).then(res => { 
      this.setState({
        employees : res.data,
        idBarActual : idBar
      })
    })
    .catch(e => {
    console.log(e);
    })
  }

  routeRedirectEmployee(username){
    const idBar = this.state.idBarActual;
    this.props.history.push(`/bar/${idBar}/employees/${username}`);
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

        const stylesComponent = {
          buttonAñadir: {
              backgroundColor: '#007bff',
              textTransform: 'none',
              letterSpacing: 'normal',
              fontSize: '20px',
              fontWeight: '600'
          }
        }

        const {idBarActual, employees} = this.state

        return (
            
        <div>
        <h1>Empleados</h1>
        <Grid justify="center" >
            {employees.map((employee) => (
            <Grid key={employee.username}>
            <Card>  
                <ButtonBase
                    onClick= {() => this.routeRedirectEmployee(employee.username)}>
                    <CardContent>
                    <Typography  className={useStyles.title} gutterBottom>
                        {employee.username}          
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {employee.firstName+" "+employee.lastName}
                    </Typography>
                    </CardContent>
                </ButtonBase>
            </Card>
            </Grid>
            ))}
        </Grid>
        <div style={{"textAlign":"center"}}>
          <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} href={`#/bar/${idBarActual}/employees/create`}>Crear Employee</Button>
        </div>
        <div style={{"textAlign":"center"}}>
          <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} href={`/`}>Volver</Button>
        </div>
        </div>

        )
    }
}
