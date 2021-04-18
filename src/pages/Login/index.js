import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

export default function Login() {
    const history = useHistory()
    const classes = useStyles()

    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const { isLogged, login, error } = useUser()

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
            let password = formData.password
            login({ username, password })
        }
    }

    function handleValidation() {
        let valid = true
        let objErrors = {}
        if (!formData.username) {
            valid = false
            objErrors["username"] = "Este campo es obligatorio"
        }
        if (!formData.password) {
            valid = false
            objErrors["password"] = "Este campo es obligatorio"
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
                    Log in
                </Typography>
                {error && (
                    <Alert severity="error" style={{ width: '100%', marginTop: 30 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField autoFocus required fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        autoComplete="username"
                        error={formErrors.username !== null && formErrors.username !== undefined && formErrors.username !== ''}
                        helperText={formErrors.username}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField required fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        type="password"
                        autoComplete="current-password"
                        error={formErrors.password !== null && formErrors.password !== undefined && formErrors.password !== ''}
                        helperText={formErrors.password}
                        onChange={(e) => handleChange(e)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Log In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="#/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    )
}
