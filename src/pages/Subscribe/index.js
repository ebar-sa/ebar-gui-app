import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'
import StarIcon from '@material-ui/icons/StarBorder'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useHistory } from 'react-router-dom'

import * as checkoutService from '../../services/checkout'

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}))

const tiers = [
  {
    title: 'PRO',
    price: '20',
    description: [
      'Carta digital',
      'Gestión de mesas',
      'Comandas en tiempo real',
      'Carta en tiempo real',
    ],
    buttonText: 'Siguiente',
    buttonVariant: 'contained',
  },
]

export default function Subscribe({ match }) {
  const classes = useStyles()
  const history = useHistory()

  const subscribe = () => {
    checkoutService
      .subscribe(match.params.id)
      .then(() => {
        history.push('/payments/subscriptions')
      })
      .catch((err) => {
        history.push('/pageNotFound')
      })
  }

  useEffect(() => {
    checkoutService.getCards().then((res) => {
      if (!res.length) history.push('/payments/add-card')
    })
  })

  return (
    <Container maxWidth="md" component="main">
      <h1>Pagar suscripción de bar</h1>
      <Grid container spacing={5} alignItems="flex-end">
        {tiers.map((tier) => (
          <Grid item key={tier.title} xs={12} md={4}>
            <Card>
              <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={tier.title === 'Pro' ? <StarIcon /> : null}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    {tier.price} €
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /mes
                  </Typography>
                </div>
                <ul>
                  {tier.description.map((line) => (
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                      key={line}
                    >
                      {line}
                    </Typography>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color="primary"
                  onClick={subscribe}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
