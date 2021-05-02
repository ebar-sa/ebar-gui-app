import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "react-credit-cards";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Payment from "payment";
import 'react-credit-cards/es/styles-compiled.css';
import * as checkoutService from '../../services/checkout'
import {create as createClient} from 'braintree-web/client'
import {create as createDataCollector} from 'braintree-web/data-collector'
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const braintreeLogo = require('../../static/images/braintree-logo-black.png');

const useStyles = makeStyles(() => ({

    root: {
        padding: "10px",
        marginBottom: "100px"
    },
    inputFile: {
        display: "none"
    },
    maxWidthImg: {
        maxWidth: "150px"
    },
    title: {
        paddingTop: "15px"
    },
    form: {
        paddingTop: "15px"
    }
}))

export default function BillCheckout(props) {

    const [state, setState] = useState({cvc: '',
        expiry: '',
        focus: '',
        name: '',
        number: ''})
    const [openProcessing, setOpenProcessing] = useState(false)
    const [openBraintreeError, setOpenBraintreeError] = useState(false)
    const [axiosError, setAxiosError] = useState(false)
    const [errors, setErrors] = useState({})


    function clearNumber(value = "") {
        return value.replace(/\D+/g, "");
    }

    function formatCreditCardNumber(value) {
        if (!value) {
            return value;
        }

        const issuer = Payment.fns.cardType(value);
        const clearValue = clearNumber(value);
        let nextValue;

        switch (issuer) {
            case "amex":
                nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                    4,
                    10
                )} ${clearValue.slice(10, 15)}`;
                break;
            case "dinersclub":
                nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                    4,
                    10
                )} ${clearValue.slice(10, 14)}`;
                break;
            default:
                nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                    4,
                    8
                )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
                break;
        }

        return nextValue.trim();
    }

    function formatCVC(value, prevValue, allValues = {}) {
        const clearValue = clearNumber(value);
        let maxLength = 4;

        if (allValues.number) {
            const issuer = Payment.fns.cardType(allValues.number);
            maxLength = issuer === "amex" ? 4 : 3;
        }

        return clearValue.slice(0, maxLength);
    }

    function formatExpirationDate(value) {
        const clearValue = clearNumber(value);

        if (clearValue.length >= 3) {
            return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
        }

        return clearValue;
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setOpenProcessing(true)
        createClient({
            authorization: 'sandbox_ktr2gzdj_j4hyq9c7ff2jmc3f'
        }, (createErr, clientInstance) => {
            if (createErr) {
                setOpenProcessing(false)
                setOpenBraintreeError(true)
            } else {
                let data = {
                    creditCard: {
                        number: state.number,
                        cvv: state.cvc,
                        expirationDate: state.expiry,
                        billingAddress: {}
                    },
                    options: {
                        validate: false
                    }
                }

                createDataCollector({
                    client: clientInstance,
                    paypal: false
                }, (err, dataCollectorInstance) => {
                    if (err) {
                        setOpenProcessing(false)
                        setOpenBraintreeError(true)
                    } else {
                        let deviceData = JSON.parse(dataCollectorInstance.deviceData)
                        console.log(deviceData)
                        generateNonce(clientInstance, data, deviceData)
                    }
                })
            }
        })

        const generateNonce = (clientInstance, data, deviceData) => {
            clientInstance.request({
                endpoint: 'payment_methods/credit_cards',
                method: 'post',
                data: data
            }, (requestErr, response) => {
                if (requestErr) {
                    setOpenProcessing(false)
                    setOpenBraintreeError(true)
                } else {
                    let nonce = response.creditCards[0].nonce
                    console.log("Nonce: " + nonce)
                    processPayment(nonce, deviceData)
                }
            })
        }

        const processPayment = (nonce, deviceData) => {
            let request = {
                amount: props.amount,
                nonce: nonce,
                deviceData: deviceData
            }

            checkoutService.payBill(request, props.table).then(response => {
                props.onCloseDialog(true)
            }).catch(error => {
                if (error.response.data.errors) {
                    setOpenProcessing(false)
                    setOpenBraintreeError(true)
                } else {
                    setOpenProcessing(false)
                    setAxiosError(true)
                }
            })
        }

    }

    const handleChange = ({target}) => {
        if (target.name === "number") {
            target.value = formatCreditCardNumber(target.value);
        } else if (target.name === "expiry") {
            target.value = formatExpirationDate(target.value);
        } else if (target.name === "cvc") {
            target.value = formatCVC(target.value);
        }

        setState({...state, [target.name]: target.value });
    }

    const handleInputFocus = ({target}) => {
        setState( {...state,
            focused: target.name
        });
    };

    const handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            setState( {...state, issuer });
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAxiosError(false)
        setOpenBraintreeError(false)
    };

    const classes = useStyles()
    return (
        <Container maxWidth={"sm"} className={classes.root}>
            <div className={classes.title}>
                <Typography className='h5' variant="h5" gutterBottom>
                    Pago de la cuenta
                </Typography>
            </div>
            <div className={classes.form}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Grid container spacing={2} alignItems="center" justify={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <Card
                                cvc={state.cvc}
                                expiry={state.expiry}
                                focused={state.focused}
                                name={state.name}
                                number={state.number}
                                callback={handleCallback}
                            />
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <TextField fullWidth required
                                       id={"number"}
                                       type={"tel"}
                                       name={"number"}
                                       label={'Número de tarjeta'}
                                       helperText={""}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleChange}
                                       onFocus={handleInputFocus}/>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <TextField fullWidth required
                                       id={"name"}
                                       name={"name"}
                                       label={'Nombre'}
                                       helperText={errors.name}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleChange}
                                       onFocus={handleInputFocus}/>
                        </Grid>
                        <Grid item xs={12} sm={6} align={"center"}>
                            <TextField fullWidth required
                                       id={"expiry"}
                                       type={"tel"}
                                       inputProps={{
                                           pattern: "\\d\\d/\\d\\d"
                                       }}
                                       name={"expiry"}
                                       label={'Fecha de caducidad'}
                                       helperText={errors.expiry}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleChange}
                                       onFocus={handleInputFocus}/>
                        </Grid>
                        <Grid item xs={12} sm={6} align={"center"}>

                            <TextField fullWidth required
                                       id={"cvc"}
                                       type={"tel"}
                                       name={"cvc"}
                                       label={'CVC'}
                                       inputProps={{
                                           pattern: "\\d{3,4}"
                                       }}
                                       helperText={errors.cvc}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleChange}
                                       onFocus={handleInputFocus}/>
                        </Grid>
                        <Grid item xs={12} sm={12} align={"center"}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                Pagar
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <img src={braintreeLogo.default} alt="" width={"20%"}/>
                        </Grid>
                    </Grid>
                </form>
            </div>

            <div>
                <Snackbar open={openBraintreeError} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="error">
                        No se ha podido procesar el pago correctamente. Revise los datos e inténtelo de nuevo.
                    </Alert>
                </Snackbar>
                <Snackbar open={axiosError} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="error">
                        Ha ocurrido un error al procesar la petición. Inténtelo de nuevo más tarde.
                    </Alert>
                </Snackbar>
                <Snackbar open={openProcessing} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="info">
                        Procesando el pago
                    </Alert>
                </Snackbar>
            </div>
        </Container>
    )
}