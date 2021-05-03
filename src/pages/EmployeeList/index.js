import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import BarDataService from "../../services/bar.service";
import {Button} from '@material-ui/core';
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as AuthService from '../../services/auth'
import EmployeeDataService from '../../services/employee.service';

import {Link} from "react-router-dom";
import Footer from "../../components/Footer";


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
        BarDataService.getBar(this.props.match.params.idBar).then(res => {
            const userActual = AuthService.getCurrentUser()
            let owner = res.data.owner;
            let emp = res.data.employees.map(a => a.username)
            if (!(owner === userActual.username || emp.includes(userActual.username))) this.props.history.push('/')
            this.getEmployees(this.props.match.params.idBar);
        }).catch(err => {
            this.props.history.push('/pageNotFound')
        })
    }

    getEmployees(idBar) {
        EmployeeDataService.getEmployees(idBar).then(res => {
            this.setState({
                employees: res.data,
                idBarActual: idBar
            })

        }).catch(err => {
            this.props.history.push('/')
        })
    }

    routeRedirectEmployee(user) {
        const idBar = this.state.idBarActual;
        this.props.history.push(`/bar/${idBar}/employees/${user}`);
    }

    render() {

        const {idBarActual, employees} = this.state

        return (
            <div style={{marginBottom:"30px"}}>
                <Container component="main" maxWidth="xs" style={{marginBottom:"26%"}}>
                    <CssBaseline/>
                    <div>
                        <div style={{"textAlign": "center"}}>
                            <h1>Empleados</h1>

                            <List component={"nav"}>
                                {employees && employees.map((employee, idx) => (
                                    <div key={employee.id}>

                                        <ListItem button component={Link}
                                                  to={"/bar/" + idBarActual + "/employees/" + employee.username}>
                                            <ListItemText
                                                primary={employee.username}
                                                secondary={"Nombre: " + employee.firstName + " " + employee.lastName}/>
                                        </ListItem>
                                        {employees.length > (idx + 1) ? <Divider/> : ""}
                                    </div>
                                ))}
                            </List>

                            <br></br>

                            <Button variant="contained" color="primary" href={`#/bar/${idBarActual}/employees/create`}>Crear
                                empleado</Button>

                            <Button variant="contained" color="primary" href={`#/bares/${idBarActual}`}>Volver</Button>
                        </div>
                    </div>
                </Container>
                <Footer/>
            </div>
        )
    }
}
