import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

import * as checkoutService from '../../services/checkout'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import Copyright from '../../components/Copyright'
import { Alert, AlertTitle } from '@material-ui/lab'
import { useHistory } from 'react-router-dom'
import { CreditCard } from '@material-ui/icons'

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

function CheckoutForm() {
  const classes = useStyles()
  const history = useHistory()
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      const token = paymentMethod.id
      checkoutService
        .addCard({ token })
        .then(() => history.push('/payments/subscriptions'))
        .catch(() => setErrorMessage('Error, intentelo más tarde.'))
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CreditCard />
        </Avatar>
        <Typography component="h1" variant="h5">
          Añadir método de pago
        </Typography>
        {errorMessage && (
          <Alert severity="error" style={{ width: '100%', marginTop: 30 }}>
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        )}
        <form className={classes.form} onSubmit={handleSubmit}>
          <div
            style={{
              padding: '20px 15px',
              border: '1px solid #ccc',
              borderRadius: 5,
              marginTop: 15,
            }}
          >
            <CardElement />
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Añadir
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default function Checkout() {
  const stripePromise = loadStripe(
    'pk_test_51IfS3oI3vLct2p8nIEP78WOfWJaQbqOhX5xBBUPM5Nc7uScq0a9z2RLM7t74QtizCDDqCq42fdWOwq1KvM6IBQP400ugfFNFIZ'
  )

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
