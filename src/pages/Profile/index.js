import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Copyright from '../../components/Copyright'
import { Alert, AlertTitle } from '@material-ui/lab'
import useUser from '../../hooks/useUser'
import { Redirect } from 'react-router'


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


export default function Profile() {
    const classes = useStyles();
    const { auth, update, isLogged, isUpdate, error } = useUser()
    const [formData, setFormData] = useState({ "email": auth != null ? auth.email : null })
    const [formErrors, setFormErrors] = useState({})

    const emailPatt = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)


    if (!isLogged) {
        return <Redirect to="/" />
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (handleValidation()) {
            let username = auth.username
            let email = formData.email
            let oldPassword = formData.oldPassword
            let password = formData.password
            let confirmPassword = formData.confirmPassword
            update({ username, email, oldPassword, password, confirmPassword })
        }
    }

    function handleValidation() {
        let valid = true
        let objErrors = {}

        if (!formData.email || !emailPatt.test(formData.email) || formData.email.length > 50) {
            valid = false
            objErrors["email"] = "Se debe introducir un correo electrónico válido y no mayor de 50 caracteres"
        }

        if (!formData.oldPassword) {
            valid = false
            objErrors["oldPassword"] = "La contraseña no puede estar vacia"
        }

        if (formData.password) {
            if (formData.password.length < 6 || formData.password.length > 40) {
                valid = false
                objErrors["password"] = "La contraseña debe tener más de 6 caracteres y menos de 40"
            }
            if (formData.password !== formData.confirmPassword) {
                valid = false
                objErrors["confirmPassword"] = "Las contraseñas deben coincidir"
            }
        }
        setFormErrors(objErrors)
        return valid
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Perfil
                </Typography>
                {error && (
                    <Alert severity="error" style={{ width: '100%', marginTop: 30 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}
                {isUpdate && (
                    <Alert severity="success" style={{ width: '100%', marginTop: 30 }}>
                        <AlertTitle>Éxito</AlertTitle>
                        Datos actualizados correctamente.
                    </Alert>
                )}
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField data-testid="username" name="username" fullWidth autoFocus id="username" variant="filled" label="Nombre de usuario" value={auth.username} disabled /><br />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField fullWidth autoFocus id="dni" variant="filled" label="Dni" value={auth.dni} disabled /><br />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField fullWidth autoFocus id="firstName" variant="filled" label="Nombre" value={auth.firstName} disabled /><br />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField fullWidth autoFocus id="lastName" variant="filled" label="Apellidos" value={auth.lastName} disabled /><br />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField fullWidth autoFocus
                                id="email" label="Email" variant="outlined"
                                autoComplete="email" name="email"
                                error={formErrors.email !== null && formErrors.email !== undefined && formErrors.email !== ''}
                                helperText={formErrors.email}
                                value={formData.email}
                                onChange={(e) => handleChange(e)} /><br />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField fullWidth autoFocus
                                id="oldPassword" label="Contraseña" variant="outlined"
                                autoComplete="oldPassword" name="oldPassword" type="password"
                                error={formErrors.oldPassword !== null && formErrors.oldPassword !== undefined && formErrors.oldPassword !== ''}
                                helperText={formErrors.oldPassword}
                                onChange={(e) => handleChange(e)} /><br />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField fullWidth autoFocus
                                id="password" label="Nueva contraseña" variant="outlined"
                                autoComplete="password" type="password" name="password"
                                error={formErrors.password !== null && formErrors.password !== undefined && formErrors.password !== ''}
                                helperText={formErrors.password}
                                onChange={(e) => handleChange(e)} /><br />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField fullWidth autoFocus
                                id="confirmPassword" label="Confirmar contraseña" variant="outlined"
                                autoComplete="confirmPassword" type="password" name="confirmPassword"
                                error={formErrors.confirmPassword !== null && formErrors.confirmPassword !== undefined && formErrors.confirmPassword !== ''}
                                helperText={formErrors.confirmPassword}
                                onChange={(e) => handleChange(e)} /><br />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Update
                    </Button>
                </form>

            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );

}