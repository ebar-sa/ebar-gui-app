import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import { makeStyles } from '@material-ui/core/styles'
import Footer from '../../components/Footer'
import useUser from '../../hooks/useUser'
import LocationSearch from '../../components/location-search-bar'
import '../../styles/home.css'
import Map from '../../components/map'

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}))

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function Home() {
  const classes = useStyles()
  const { isLogged } = useUser()
  const [location, setLocation] = useState()
  const [error, setError] = useState(false)

  return (

    <React.Fragment>
      <CssBaseline />
      <main>
        <div className={classes.heroContent}>
          <Container>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Ebar app
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Tu bar a la palma de la mano. Carta digital como nunca la habías
              visto. Gestión del entretenimiento.
            </Typography>
            {isLogged ?
              <div className='container'>
                <div className='typo'>
                  <Typography
                    variant="h6"
                    align="center"
                    color="textSecondary"
                    paragraph
                  >
                    ¿En que zona desea buscar restaurantes?
                  </Typography>
                </div>
                  <LocationSearch setError={setError} setLocation={setLocation} />
                  {error === true && <p className='error'>Error al obtener la dirección</p>}
                  <Map setError={setError} error={error} setLocation={setLocation} location={location}/>
              </div>
          :
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="contained" color="primary">
                  Comienza ahora
              </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  descargar
              </Button>
              </Grid>
            </Grid>
          </div>
          }
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe
                      the content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </React.Fragment> 
  )
}
