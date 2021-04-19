import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Typography, CardContent, Grid, Card, Button, ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import EmployeeDataService from '../services/employee.service';


export default class EmployeeList extends Component {
  constructor(props) {
    super(props)
    this.getEmployees = this.getEmployees.bind(this);

    this.state = {
      idBarActual: null,
      employees: []
    };

  }

  componentDidMount() {
    console.log(this.props.match.params.idBar);
    this.getEmployees(this.props.match.params.idBar);
  }

  getEmployees(idBar) {
    EmployeeDataService.getEmployees(idBar).then(res => {
      this.setState({
        employees: res.data,
        idBarActual: idBar
      })
    })
      .catch(e => {
        console.log(e);
      })
  }

  routeRedirectEmployee(user) {
    const idBar = this.state.idBarActual;
    this.props.history.push(`/bar/${idBar}/employees/${user}`);
  }

  render() {
    const useStyles = makeStyles({
      title: {
        fontSize: 16,
        margin: 'auto',
      },
      botton: {
        fontSize: 16,

      },
      cardAction: {
        width: '100%',
      },
      pos: {
        marginBottom: 12,
      },
      card: {
        margin: 16,
        display: "flex",
        flexDirection: "column",
        maxWidth: 100,
        justifyContent: "space-between"
      },
      root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: '5rem',
      },
    })

    const { idBarActual, employees } = this.state

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={useStyles.root}>
          <div style={{ "textAlign": "center" }}>
            <h1>Empleados</h1>

            {employees.map((employee) => (
              <Grid container className={useStyles.title} wrap="nowrap" spacing={0} key={employee.username}>
                <Card>
                  <ButtonBase
                    onClick={() => this.routeRedirectEmployee(employee.username)}>
                    <CardContent>
                      <Typography className={useStyles.title} gutterBottom>
                        {employee.username}
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {employee.firstName + " " + employee.lastName}
                      </Typography>
                    </CardContent>
                  </ButtonBase>
                </Card>
              </Grid>
            ))}


            <br></br>

            <Button variant="contained" color="primary" href={`#/bar/${idBarActual}/employees/create`}>Crear empleado</Button>


            <Button variant="contained" color="primary" href={`#/bares/${idBarActual}`}>Volver</Button>
          </div>
        </div>
      </Container>
    )
  }
}
