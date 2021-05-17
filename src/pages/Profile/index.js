import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import {Alert, AlertTitle} from '@material-ui/lab'
import useUser from '../../hooks/useUser'
import {Redirect} from 'react-router'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Avatar from '@material-ui/core/Avatar'
import emailjs from 'emailjs-com'
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar"
import Footer from "../../components/Footer";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
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

export function EmailDialog({dialogAction, setDialogAction, auth}) {
    const [ok, setOk] = useState(false);
    const [fail, setFail] = useState(false);

    const handleClose = () => {
        setDialogAction(null);
    };

    const handleSend = () => {
        const data = {username: auth.username, action: dialogAction}

        emailjs
            .send(
                'service_z3g14gq', 'template_tp5askn', data, 'user_HB6af1O6KYhHM6eG9L61H'
            )
            .then(
                (result) => setOk(true),
                (error) => setFail(true)
            )
        setDialogAction(null);
    };

    return (
        <>
            <Snackbar open={ok} autoHideDuration={6000} onClose={() => setOk(false)}>
                <Alert onClose={() => setOk(false)} severity="success" data-testid="requestSentAlert">
                    Se ha enviado la solicitud
                </Alert>
            </Snackbar>
            <Snackbar
                open={fail}
                autoHideDuration={6000}
                onClose={() => setFail(false)}
            >
                <Alert onClose={() => setFail(false)} severity="error" data-testid="requestSentAlertError">
                    Ha ocurrido un error, vuelva a intentarlo más tarde
                </Alert>
            </Snackbar>
            <Dialog
                open={dialogAction !== null}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                data-testid="acceptOrDeclineDialog"
            >
                <DialogTitle id="alert-dialog-title">{"¿Está seguro?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogAction === "DATOS"
                            ? "La información puede tardar un tiempo en ser enviada"
                            : "La eliminación puede tardar un tiempo en ser completada"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSend} color="primary" autoFocus data-testid="acceptDialog">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default function Profile(props) {

    const classes = useStyles();
    const {auth, update, updateBraintreeData, isLogged, isUpdate, error} = useUser()
    const [openBraintreeDialog, setOpenBraintreeDialog] = useState(!!(props.history?.location.state))
    const [formData, setFormData] = useState({"email": auth != null ? auth.email : null})
    const [braintreeFormData, setBraintreeFormData] = useState({
        "merchantId": auth.braintreeMerchantId,
        "publicKey": auth.braintreePublicKey,
        "privateKey": auth.braintreePrivateKey
    })
    const [formErrors, setFormErrors] = useState({})

    const [dialogAction, setDialogAction] = React.useState(null);

    const emailPatt = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)


    if (!isLogged) {
        return <Redirect to="/"/>
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        setFormErrors({})
    }

    const handleBraintreeChange = (e) => {
        setBraintreeFormData({...braintreeFormData, [e.target.name]: e.target.value})
        setFormErrors({})
    }

    const handleOpenDialog = () => {
        setOpenBraintreeDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenBraintreeDialog(false)
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (handleValidation()) {
            let username = auth.username
            let email = formData.email
            let oldPassword = formData.oldPassword
            let password = formData.password
            let confirmPassword = formData.confirmPassword
            update({username, email, oldPassword, password, confirmPassword})
        }
    }

    const handleBraintreeSubmit = (e) => {
        e.preventDefault()
        if (handleBraintreeValidation()) {
            updateBraintreeData({...braintreeFormData, username: auth.username})
            setOpenBraintreeDialog(false)
        }
    }

    const handleBraintreeValidation = () => {
        let valid = true
        let objErrors = {}

        if (!braintreeFormData.merchantId) {
            valid = false
            objErrors["merchantId"] = "El campo no puede estar vacío"
        }

        if (!braintreeFormData.publicKey) {
            valid = false
            objErrors["publicKey"] = "El campo no puede estar vacío"
        }

        if (!braintreeFormData.privateKey) {
            valid = false
            objErrors["privateKey"] = "El campo no puede estar vacío"
        }
        setFormErrors(objErrors)
        return valid
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
        <div style={{marginBottom: '30px'}}>
            <Container component="main" maxWidth="sm">
                <CssBaseline/>

                <EmailDialog
                    auth={auth}
                    dialogAction={dialogAction}
                    setDialogAction={setDialogAction}
                />

                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Perfil
                    </Typography>
                    {error && (
                        <Alert severity="error" style={{width: '100%', marginTop: 30}}>
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    )}
                    {isUpdate && (
                        <Alert severity="success" style={{width: '100%', marginTop: 30}}>
                            <AlertTitle>Éxito</AlertTitle>
                            Datos actualizados correctamente.
                        </Alert>
                    )}
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField data-testid="username" name="username" fullWidth autoFocus id="username"
                                           variant="filled" label="Nombre de usuario" value={auth.username}
                                           disabled/><br/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth autoFocus id="dni" variant="filled" label="DNI" value={auth.dni}
                                           disabled/><br/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth autoFocus id="firstName" variant="filled" label="Nombre"
                                           value={auth.firstName} disabled/><br/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth autoFocus id="lastName" variant="filled" label="Apellidos"
                                           value={auth.lastName} disabled/><br/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth autoFocus
                                           id="email" label="Email" variant="standard"
                                           autoComplete="email" name="email"
                                           error={formErrors.email !== null && formErrors.email !== undefined && formErrors.email !== ''}
                                           helperText={formErrors.email}
                                           value={formData.email}
                                           onChange={(e) => handleChange(e)}/><br/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth autoFocus
                                           id="oldPassword" label="Contraseña" variant="standard"
                                           autoComplete="oldPassword" name="oldPassword" type="password"
                                           error={formErrors.oldPassword !== null && formErrors.oldPassword !== undefined && formErrors.oldPassword !== ''}
                                           helperText={formErrors.oldPassword}
                                           onChange={(e) => handleChange(e)}/><br/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth autoFocus
                                           id="password" label="Nueva contraseña" variant="standard"
                                           autoComplete="password" type="password" name="password"
                                           error={formErrors.password !== null && formErrors.password !== undefined && formErrors.password !== ''}
                                           helperText={formErrors.password}
                                           onChange={(e) => handleChange(e)}/><br/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth autoFocus
                                           id="confirmPassword" label="Confirmar contraseña" variant="standard"
                                           autoComplete="confirmPassword" type="password" name="confirmPassword"
                                           error={formErrors.confirmPassword !== null && formErrors.confirmPassword !== undefined && formErrors.confirmPassword !== ''}
                                           helperText={formErrors.confirmPassword}
                                           onChange={(e) => handleChange(e)}/><br/>
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
                    </form>
                    <Grid container spacing={2} style={{marginTop: '10px', marginBottom: '20px', alignItems: 'center'}}>
                        {auth.roles.includes('ROLE_OWNER') && (
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleOpenDialog}
                                >
                                    Introducir credenciales de Braintree
                                </Button>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={() => setDialogAction("DATOS")}
                                data-testid="requestDataButton"
                            >
                                Solicitar datos de la cuenta
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={() => setDialogAction("ELIMINAR")}
                            >
                                Solicitar la eliminación de sus datos en la aplicación
                            </Button>
                        </Grid>

                    </Grid>
                </div>
            </Container>
            {auth.roles.includes('ROLE_OWNER') && (
            <Dialog open={openBraintreeDialog && auth.roles.includes('ROLE_OWNER')}
                    data-testid={"braintree-dialog"}
                    onClose={handleCloseDialog}
                    aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Credenciales de Braintree</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center" justify={"center"}>
                        <Grid item xs={12}>
                            <TextField fullWidth required
                                       id={"merchantId"}
                                       type={"text"}
                                       name={"merchantId"}
                                       label={'Id de comerciante'}
                                       error={formErrors.merchantId !== null && formErrors.merchantId !== undefined && formErrors.merchantId !== ''}
                                       helperText={formErrors.merchantId}
                                       variant={"standard"}
                                       value={braintreeFormData.merchantId}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleBraintreeChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth required
                                       id={"publicKey"}
                                       type={"text"}
                                       name={"publicKey"}
                                       label={'Clave pública'}
                                       error={formErrors.publicKey !== null && formErrors.publicKey !== undefined && formErrors.publicKey !== ''}
                                       helperText={formErrors.publicKey}
                                       variant={"standard"}
                                       value={braintreeFormData.publicKey}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleBraintreeChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth required
                                       id={"privateKey"}
                                       type={"text"}
                                       name={"privateKey"}
                                       label={'Clave privada'}
                                       error={formErrors.privateKey !== null && formErrors.privateKey !== undefined && formErrors.privateKey !== ''}
                                       helperText={formErrors.privateKey}
                                       variant={"standard"}
                                       value={braintreeFormData.privateKey}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleBraintreeChange}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBraintreeSubmit} color="primary">
                        Registrar claves
                    </Button>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            )}
            <Footer/>
        </div>
    );

}