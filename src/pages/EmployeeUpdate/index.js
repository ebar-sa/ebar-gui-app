import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router"
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import useEmployee from '../../hooks/useEmployee'
import Copyright from '../../components/Copyright'
import { Alert, AlertTitle } from '@material-ui/lab'
import EmployeeDataService from "../../services/employee.service";


const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submit: {
        margin: theme.spacing(3, 0, 0),
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },

}));

export default function UpdateEmployee(props) {
    const classes = useStyles();
    const history = useHistory();

    const [formErrors, setFormErrors] = useState({})
    const [employee, setEmployee] = useState({})

    const [state, setState] = useState({})

    const roles = ['ROLE_EMPLOYEE'];
    const idBar = props.match.params.idBarActual
    const user = props.match.params.userActual
    const emailPatt = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)
    const phonePatt = new RegExp("^[+]*[(]?[0-9]{1,4}[)]?[-s./0-9]*$")


    const { updateemployee, error } = useEmployee()


    const handleChange = (e) => {
        console.log(e.target.name)
        console.log(e.target.value)
        setState({ ...state, [e.target.name]: e.target.value })
        setFormErrors({})
    }

    console.log(employee)
    const handleSubmit = (e) => {
        e.preventDefault()
        if (handleValidation()) {
            let username = state.username
            let email = state.email
            let firstName = state.firstName
            let lastName = state.lastName
            let dni = state.dni
            let phoneNumber = state.phoneNumber
            updateemployee(idBar, user, { username, email, roles, firstName, lastName, dni, phoneNumber })
            props.history.push(`/bar/${idBar}/employees`);
            window.location.reload();
        }
    }

    function handleValidation() {
        let valid = true
        let objErrors = {}
        if (!state.email || !emailPatt.test(state.email) || state.email.length > 50) {
            valid = false
            objErrors["email"] = "Se debe introducir un correo electrónico válido y no mayor de 50 caracteres"
        }
        if (!employee.firstName) {
            valid = false
            objErrors["firstName"] = "El nombre no puede estar vacío"
        }
        if (!employee.lastName) {
            valid = false
            objErrors["lastName"] = "El apellido no puede estar vacío"
        }
        if (!employee.phoneNumber || !phonePatt.test(employee.phoneNumber)) {
            valid = false
            objErrors["phoneNumber"] = "Se debe introducir un número de teléfono válido"
        }
        setFormErrors(objErrors)
        return valid
    }

    useEffect(() => {
        EmployeeDataService.getEmployeeByUsername(idBar, user).then(res => {
            console.log("adios", res.data)
            console.log("hola", user)
            if (res && res.data.username === (user)) {
                let initialState = {
                    username: res.data.username,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    phoneNumber: res.data.phoneNumber
                }
                setEmployee(res.data)

                setState(
                    initialState
                )
            } else {
                history.push('/pageNotFound/')
            }

        }).catch(err => {
            console.log("Error", err)
        })
    }, [idBar, user, history])


    console.log("email", state.email)
    return (
        <div>
            {Object.keys(state).length !== 0 &&
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Actualizar empleado
                </Typography>
                        {error && (
                            <Alert severity="error" style={{ width: '100%', marginTop: 30 }}>
                                <AlertTitle>Error</AlertTitle>
                                {error}
                            </Alert>
                        )}

                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField disabled fullWidth autoFocus
                                        id="username"
                                        value={state.username}
                                        name={"username"}
                                        label={"Nombre de usuario"}
                                        variant={"outlined"}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth
                                        id="firstName"
                                        defaultValue={state.firstName}
                                        name="firstName"
                                        label="Nombre"
                                        autoComplete="fname"
                                        variant="outlined"
                                        error={formErrors.firstName !== null && formErrors.firstName !== undefined && formErrors.firstName !== ''}
                                        helperText={formErrors.firstName}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth
                                        id="lastName"
                                        defaultValue={state.lastName}
                                        name="lastName"
                                        label="Apellidos"
                                        variant="outlined"
                                        error={formErrors.lastName !== null && formErrors.lastName !== undefined && formErrors.lastName !== ''}
                                        helperText={formErrors.lastName}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                        id="email"
                                        value={state.email}
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        placeholder="example@mail.com"
                                        error={formErrors.email !== null && formErrors.email !== undefined && formErrors.email !== ''}
                                        helperText={formErrors.email}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                        id="phoneNumber"
                                        defaultValue={state.phoneNumber}
                                        name="Telefono"
                                        label="Phone Number"
                                        variant="outlined"
                                        error={formErrors.phoneNumber !== null && formErrors.phoneNumber !== undefined && formErrors.phoneNumber !== ''}
                                        helperText={formErrors.phoneNumber}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                        id="dni"
                                        defaultValue={state.dni}
                                        name="dni"
                                        label="DNI"
                                        variant="outlined"
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Actualizar
                    </Button>
                            <Button fullWidth variant="contained" color="primary" className={classes.submit} href={`#/bar/${idBar}/employees`}>Volver</Button>
                        </form>
                    </div>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </Container>

            }
        </div>
    );
}