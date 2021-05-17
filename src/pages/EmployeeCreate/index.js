import React, { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser'
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
import { useHistory } from "react-router"
import BarDataService from "../../services/bar.service";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 0),
    },
}));

export default function CreateEmployee(props) {
    const classes = useStyles();
    const history = useHistory()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const { auth } = useUser()
    const roles = ['ROLE_EMPLOYEE'];
    const idBar = props.match.params.idBar
    const emailPatt = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)
    const phonePatt = new RegExp("^[+]*[(]?[0-9]{1,4}[)]?[-s./0-9]*$")
    const dniPatt = new RegExp("^[0-9]{8}[A-Z]$")


    const { createemployee, error } = useEmployee()


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (handleValidation()) {
            let username = formData.username
            let email = formData.email
            let password = formData.password
            let firstName = formData.firstName
            let lastName = formData.lastName
            let dni = formData.dni
            let phoneNumber = formData.phoneNumber
            createemployee(idBar, { username, email, roles, password, firstName, lastName, dni, phoneNumber })
        }

    }

    useEffect(() => {
        BarDataService.getBar(idBar).then(res => {
            let owner = res.data.owner;
            if (owner !== auth.username) history.push('/')
        }).catch(err => {
            history.push('/pageNotFound')
        })
    }, [idBar, history, auth.username])

    function handleValidation() {
        let valid = true
        let objErrors = {}

        if (!formData.email || !emailPatt.test(formData.email) || formData.email.length > 50) {
            valid = false
            objErrors["email"] = "Se debe introducir un correo electrónico válido y no mayor de 50 caracteres"
        }
        if (!formData.username || formData.username.length < 3 || formData.username.length > 20) {
            valid = false
            objErrors["username"] = "El nombre de usuario debe tener más de 3 caracteres y menos de 20"
        }
        if (!formData.password || formData.password.length < 6 || formData.password.length > 40) {
            valid = false
            objErrors["password"] = "La contraseña debe tener más de 6 caracteres y menos de 40"
        }

        if (!formData.dni || !dniPatt.test(formData.dni)) {
            valid = false
            objErrors["dni"] = "El DNI introducido no es válido, debe tener 8 dígitos seguidos de una letra mayúscula"
        }

        if (!formData.lastName) {
            valid = false
            objErrors["lastName"] = "El apellido no puede estar vacío"
        }
        if (!formData.firstName) {
            valid = false
            objErrors["firstName"] = "El nombre no puede estar vacío"
        }
        if (!formData.phoneNumber || !phonePatt.test(formData.phoneNumber)) {
            valid = false
            objErrors["phoneNumber"] = "Se debe introducir un número de teléfono válido"
        }
        setFormErrors(objErrors)
        return valid
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Crear empleado
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
                            <TextField fullWidth required autoFocus
                                name={"username"}
                                id={"username"}
                                autoComplete={"username"}
                                label={"Nombre de usuario"}
                                variant={"standard"}
                                error={formErrors.username !== null && formErrors.username !== undefined && formErrors.username !== ''}
                                helperText={formErrors.username}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth
                                name="firstName"
                                id="firstName"
                                autoComplete="fname"
                                label="Nombre"
                                variant="standard"
                                error={formErrors.firstName !== null && formErrors.firstName !== undefined && formErrors.firstName !== ''}
                                helperText={formErrors.firstName}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth
                                name="lastName"
                                id="lastName"
                                variant="standard"
                                label="Apellido"
                                autoComplete="lname"
                                error={formErrors.lastName !== null && formErrors.lastName !== undefined && formErrors.lastName !== ''}
                                helperText={formErrors.lastName}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth
                                name="email"
                                id="email"
                                autoComplete="email"
                                label="Email"
                                variant="standard"
                                placeholder="example@mail.com"
                                error={formErrors.email !== null && formErrors.email !== undefined && formErrors.email !== ''}
                                helperText={formErrors.email}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth
                                name="phoneNumber"
                                id="phoneNumber"
                                variant="standard"
                                label="Telefono"
                                autoComplete="phone"
                                error={formErrors.phoneNumber !== null && formErrors.phoneNumber !== undefined && formErrors.phoneNumber !== ''}
                                helperText={formErrors.phoneNumber}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth
                                name="dni"
                                id="dni"
                                variant="standard"
                                label="DNI"
                                autoComplete="dni"
                                placeholder="12345678A"
                                error={formErrors.dni !== null && formErrors.dni !== undefined && formErrors.dni !== ''}
                                helperText={formErrors.dni}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth
                                name="password"
                                id="password"
                                variant="standard"
                                label="Contraseña"
                                type="password"
                                autoComplete="current-password"
                                error={formErrors.password !== null && formErrors.password !== undefined && formErrors.password !== ''}
                                helperText={formErrors.password}
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
                        Crear
                    </Button>
                    <Button fullWidth variant="contained" color="primary" className={classes.submit} href={`#/bar/${idBar}/employees`}>Volver</Button>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}