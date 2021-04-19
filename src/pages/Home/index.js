import React, { useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import { makeStyles } from '@material-ui/core/styles'
import Footer from '../../components/Footer'
import useUser from '../../hooks/useUser'
import LocationSearch from '../../components/LocationSearch'
import '../../styles/home.css'
import Map from '../../components/map'
import Logo from "../../img/ebarLogo.png"

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
  center1: {
    margin: 'auto',
    display: 'block',
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
            <img alt="" src={Logo} width="50%" height="50%" className={classes.center1} /><br></br>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            ><br></br>
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
                <Map setError={setError} error={error} setLocation={setLocation} location={location} />
              </div>
              :
              <div className={classes.heroButtons}>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph
                ><br></br>
              Inicia sesión para poder disfrutar de todos nuestros servicios.
            </Typography>
              </div>
            }
          </Container>
        </div>

      </main>
      <Footer />
    </React.Fragment>
  )
}
