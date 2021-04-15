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

  routeRedirectEmployee(user){
    const idBar = this.state.idBarActual;
    this.props.history.push(`/bar/${idBar}/employees/${user}`);
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
            flexGrow: 1,
            overflow: 'hidden',
            padding: '5rem',
          },
        })

        const stylesComponent = {
          buttonAñadir: {
              color: "primary",
              textTransform: 'none',
              letterSpacing: 'normal',
              fontSize: '20px',
              fontWeight: '600'
          }
        }

        const {idBarActual, employees} = this.state

        return (
            
        <div className={useStyles.root}>
        <h1>Empleados</h1>
        
            {employees.map((employee) => (
            <Grid container wrap="nowrap" spacing={0} key={employee.username}>
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
        
        <div style={{"textAlign":"center"}}>


          <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} href={`#/bar/${idBarActual}/employees/create`}>Crear Employee</Button>
        
        
          <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} href={`/`}>Volver</Button>
        </div>
        </div>

        )
    }
}
