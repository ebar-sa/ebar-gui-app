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
    const [errors, setErrors] = useState({})

    function generateRandomString(characters) {
        let result = ''
        const charactersLength = characters.length
        for ( let i = 0; i < charactersLength; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result
    }

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

    function formatExpiryForRequest(expiry) {
        let sp = expiry.split("/")
        return sp[1] + sp[0]
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const CryptoJS = require("crypto-js");
        // let stateAmount = props.history.location.state
        const merchantOrder = generateRandomString('0123456789') + generateRandomString('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
        const testValues = {
            "Ds_Merchant_MerchantCode": "999008881",
            "Ds_Merchant_Terminal": "1",
            "Ds_Merchant_TransactionType": "0",
            "Ds_Merchant_Amount": "150",
            "Ds_Merchant_Currency": "978",
            "Ds_Merchant_Order": merchantOrder,
            "Ds_Merchant_Pan": 4548812049400004,
            "Ds_Merchant_ExpiryDate": 2112,
            "Ds_Merchant_CVV2": 123
        }

        let merchantWordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(testValues));
        let merchantBase64 = merchantWordArray.toString(CryptoJS.enc.Base64);
        let keyWordArray = CryptoJS.enc.Base64.parse("sq7HjrUOBfKmC576ILgskD5srU870gJ7");

        let iv = CryptoJS.enc.Hex.parse("0000000000000000");
        let cipher = CryptoJS.TripleDES.encrypt(testValues.Ds_Merchant_Order, keyWordArray, {
            iv:iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });

        let signature = CryptoJS.HmacSHA256(merchantBase64, cipher.ciphertext);
        let signatureBase64 = signature.toString(CryptoJS.enc.Base64);

        let request = {
            "Ds_SignatureVersion": "HMAC_SHA256_V1",
            "Ds_MerchantParameters": merchantBase64,
            "Ds_Signature": signatureBase64
        }

        checkoutService.payBill(request).then(response => {
            if (response.data.errorCode) {
                console.log(response.data.errorCode)
            } else if (response.data.ds_response < 100) {
                console.log("Pago perfe")
                // props.history.push({
                //     pathname: response.headers["location"],
                //     state: {
                //         data: true
                //     }
                // })
            }
        }).catch(error => {
            console.log("Error" + error)

        })
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
                    </Grid>
                </form>
            </div>
        </Container>
    )
}