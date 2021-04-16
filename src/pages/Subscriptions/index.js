import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { Button, Paper } from '@material-ui/core'

import * as checkoutService from '../../services/checkout'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '10px',
  },
  list: {
    textAlign: 'left',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function Subscriptions() {
  const classes = useStyles()
  const history = useHistory()
  const [subscriptions, setSubscriptions] = useState([])
  const [cards, setCards] = useState([])

  const loadCards = () => {
    checkoutService
      .getCards()
      .then((response) => {
        setCards(response)
        console.log(response)
      })
      .catch((err) => alert('error'))
  }

  const loadSubscriptions = () => {
    checkoutService
      .getSubscriptions()
      .then((response) => {
        console.log(response)
        setSubscriptions(response)
      })
      .catch((err) => alert('error'))
  }

  const setCardAsDefault = (token) => {
    checkoutService
      .setDefaultCard({ token })
      .then((res) => {
        setCards(cards.map((c) => ({ ...c, default: c.token === token })))
      })
      .catch((err) => alert('error'))
  }

  const cancelSubscription = (id) => {
    checkoutService
      .cancel(id)
      .then((res) => {
        setSubscriptions(
          subscriptions.map((s) => ({
            ...s,
            cancel_at_period_end: s.bar_id === id,
          }))
        )
      })
      .catch((err) => {
        alert('err')
      })
  }

  const removeCard = (token) => {
    checkoutService
      .removeCard({ token })
      .then((res) => {
        setCards(cards.filter((c) => c.token !== token))
      })
      .catch((err) => {
        alert('err')
      })
  }

  useEffect(() => {
    loadCards()
    loadSubscriptions()
  }, [])

  return (
    <Container component="div" maxWidth="sm" className={classes.container}>
      <Typography
        component={'h4'}
        variant={'h4'}
        align={'center'}
        style={{ margin: '30px 0' }}
      >
        Mis suscripciones
      </Typography>
      <Paper className={classes.container}>
        <List component={'nav'} className={classes.list}>
          {subscriptions &&
            subscriptions.map((sub, idx) => (
              <div key={sub.bar_id}>
                <ListItem>
                  <ListItemText
                    primary={sub.bar_name || 'Unnamed'}
                    secondary={`Válido hasta: ${new Date(
                      Number(sub.period_end * 1000)
                    ).toLocaleDateString('es-ES')}`}
                  />
                  {sub.cancel_at_period_end ? (
                    <Button
                      color={'primary'}
                      onClick={() =>
                        history.push('/payments/subscribe/' + sub.bar_id)
                      }
                    >
                      Renovar
                    </Button>
                  ) : (
                    <Button
                      color={'secondary'}
                      onClick={() => cancelSubscription(sub.bar_id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </ListItem>
                {subscriptions.length > idx + 1 ? <Divider /> : ''}
              </div>
            ))}
        </List>
      </Paper>
      <Typography
        component={'h4'}
        variant={'h4'}
        align={'center'}
        style={{ margin: '30px 0' }}
      >
        Mis métodos de pago
      </Typography>
      <Paper className={classes.container}>
        <List component={'nav'} className={classes.list}>
          {cards &&
            cards.map((card, idx) => (
              <div key={card.token}>
                <ListItem
                  style={{ background: card.default ? '#eee' : '#fff' }}
                >
                  <ListItemText
                    primary={card.brand.toUpperCase()}
                    secondary={`**** **** **** ${card.last4}`}
                  />
                  {!card.default && (
                    <Button
                      color={'primary'}
                      onClick={() => setCardAsDefault(card.token)}
                    >
                      ELEGIR COMO PREFERIDA
                    </Button>
                  )}
                  <Button
                    color={'secondary'}
                    onClick={() => removeCard(card.token)}
                  >
                    ELIMINAR
                  </Button>
                </ListItem>
                {cards.length > idx + 1 ? <Divider /> : ''}
              </div>
            ))}
        </List>
      </Paper>
      <Button onClick={() => history.push('/payments/add-card')}>
        + Añadir tarjeta de crédito
      </Button>
    </Container>
  )
}
