import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useHistory } from 'react-router'

import useUser from '../../hooks/useUser'
import Copyright from '../../components/Copyright'
import { Alert, AlertTitle } from '@material-ui/lab'

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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const history = useHistory();

    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const roles = ['ROLE_CLIENT']
    const emailPatt = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)
    const phonePatt = new RegExp("^[+]*[(]?[0-9]{1,4}[)]?[-s./0-9]*$")
    const dniPatt = new RegExp("^[0-9]{8}[A-Z]$")

    const { isLogged, isRegistered, signup, error } = useUser()

    useEffect(() => {
        if (isLogged) {
            history.push('/')
        }
    }, [isLogged, history])

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
            signup({ username, email, roles, password, firstName, lastName, dni, phoneNumber })
        }
    }

    function handleValidation() {
        let valid = true
        let objErrors = {}
        if (!formData.username || formData.username.length < 3 || formData.username.length > 20) {
            valid = false
            objErrors["username"] = "El nombre de usuario debe tener más de 3 caracteres y menos de 20"
        }
        if (!formData.email || !emailPatt.test(formData.email) || formData.email.length > 50) {
            valid = false
            objErrors["email"] = "Se debe introducir un correo electrónico válido y no mayor de 50 caracteres"
        }
        if (!formData.password || formData.password.length < 6 || formData.password.length > 40) {
            valid = false
            objErrors["password"] = "La contraseña debe tener más de 6 caracteres y menos de 40"
        }
        if (!formData.firstName) {
            valid = false
            objErrors["firstName"] = "El nombre no puede estar vacío"
        }
        if (!formData.lastName) {
            valid = false
            objErrors["lastName"] = "El apellido no puede estar vacío"
        }
        if (formData.dni && !dniPatt.test(formData.dni)) {
            valid = false
            objErrors["dni"] = "El DNI introducido no es válido, debe tener 8 dígitos seguidos de una letra mayúscula"
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
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registrarse
                </Typography>
                {error && (
                    <Alert severity="error" style={{ width: '100%', marginTop: 30 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}
                {isRegistered && (
                    <Alert severity="success" style={{ width: '100%', marginTop: 30 }}>
                        <AlertTitle>Éxito</AlertTitle>
                        Te has registrado correctamente. <a href="#/login">Pulsa aquí</a> para iniciar sesión.
                    </Alert>
                )}
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth required autoFocus
                                id={"username"}
                                name={"username"}
                                label={"Nombre de usuario"}
                                autoComplete={"username"}
                                variant={"outlined"}
                                error={formErrors.username !== null && formErrors.username !== undefined && formErrors.username !== ''}
                                helperText={formErrors.username}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth
                                id="firstName"
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
                            <TextField required fullWidth
                                id="lastName"
                                name="lastName"
                                label="Apellido"
                                variant="outlined"
                                autoComplete="lname"
                                error={formErrors.lastName !== null && formErrors.lastName !== undefined && formErrors.lastName !== ''}
                                helperText={formErrors.lastName}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                autoComplete="email"
                                variant="outlined"
                                placeholder="example@mail.com"
                                error={formErrors.email !== null && formErrors.email !== undefined && formErrors.email !== ''}
                                helperText={formErrors.email}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Teléfono"
                                variant="outlined"
                                autoComplete="phone"
                                error={formErrors.phoneNumber !== null && formErrors.phoneNumber !== undefined && formErrors.phoneNumber !== ''}
                                helperText={formErrors.phoneNumber}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth
                                id="dni"
                                name="dni"
                                label="DNI"
                                variant="outlined"
                                autoComplete="dni"
                                placeholder="12345678A"
                                error={formErrors.dni !== null && formErrors.dni !== undefined && formErrors.dni !== ''}
                                helperText={formErrors.dni}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth
                                id="password"
                                name="password"
                                label="Contraseña"
                                variant="outlined"
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
                        Registrarse
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="#/login" variant="body2">
                                Inicia sesión
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}