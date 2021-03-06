import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import Footer from '../../components/Footer';
import useUser from '../../hooks/useUser';
import LocationSearch from '../../components/LocationSearch';
import '../../styles/home.css';
import Map from '../../components/map';
import {Button, Grid, Paper, useMediaQuery} from '@material-ui/core';

import img1 from "../../img/img1.png";
import img2 from "../../img/img2.png";
import img3 from "../../img/img3.png";
import Logo from "../../img/ebarLogo.png"
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

import './style.css';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(0, 0, 6),
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
    image: {
        float: "right",
        marginTop: "40px"
    },
    paper: {
        padding: '30px',
        height: '100%',
    },
    logContainer: {
        margin: "auto",
        justifyContent: "center",
        marginTop: "30px",
        backgroundColor: "#1d1dd505",
        borderRadius: "10px",
        textAlign: "center",
        position: "relative",
        paddingBottom: "50px",
        marginBottom: "20px"
    }
}));

function Landing() {
    const classes = useStyles();
    const theme = useTheme();
    const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <CssBaseline/>
            <main>
                <div className={classes.heroContent}>
                    <div style={{background: '#fff', paddingBottom: 80}}>
                        <Container>
                            <Grid container>
                                <Grid item md={6} xs={12}>
                                    <Typography
                                        variant="h4"
                                        align="left"
                                        style={{marginTop: 60}}
                                        className="text"
                                    >
                                        No m??s listas de espera.
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        align="left"
                                        color="textSecondary"
                                        paragraph
                                    >
                                        Con ebar evita las listas de espera con el control de aforo.
                                        Tu bar a la palma de la mano. Carta digital como nunca la
                                        hab??as visto. Gesti??n del entretenimiento.
                                    </Typography>
                                    <Button
                                        href="/#/signup"
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Empezar ahora
                                    </Button>
                                    <Button
                                        href="/#/login"
                                        variant="contained"
                                        color="light"
                                        className={classes.submit}
                                        style={{marginLeft: 10}}
                                    >
                                        Iniciar sesi??n
                                    </Button>
                                </Grid>
                                {!phoneScreen && (
                                    <Grid item md={6} xs={12} className={classes.center1}>
                                        <img className={classes.image} alt="logo" src={Logo} width="60%" height="60%"/>
                                    </Grid>
                                )}
                            </Grid>
                        </Container>
                    </div>
                    <div style={{backgroundColor: '#f7f7f7', padding: '50px 0'}}>
                        <Typography
                            align="center"
                            style={{color: '#006e85', fontWeight: 'bold'}}
                        >
                            ??QU?? OFRECEMOS?
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            style={{fontWeight: 'bold', marginBottom: 30}}
                        >
                            Las mejores herramientas para tu bar
                        </Typography>
                        <Container style={{maxWidth: 1200}}>
                            <Grid container alignItems="stretch" spacing={3}>
                                <Grid item md={4} xs={12}>
                                    <Paper className={classes.paper}>
                                        <img
                                            src={img2}
                                            width="60px"
                                            alt="feature"
                                        />
                                        <Typography variant="h6">Carta digital</Typography>
                                        <Typography>
                                            Permite a tus clientes pedir desde el m??vil. Las comandas
                                            llegar??n directamente a la barra o cocina.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Paper className={classes.paper}>
                                        <img
                                            src={img1}
                                            width="60px"
                                            alt="feature"
                                        />
                                        <Typography variant="h6">Control de aforo</Typography>
                                        <Typography>
                                            Gracias al control de aforo los clientes podr??n ver en
                                            tiempo real la ocupaci??n del local, evitando as??
                                            aglomeraciones.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Paper className={classes.paper}>
                                        <img
                                            src={img3}
                                            width="60px"
                                            alt="feature"
                                        />
                                        <Typography variant="h6">
                                            Gesti??n del entretenimiento
                                        </Typography>
                                        <Typography>
                                            Los clientes podr??n votar diferentes opciones de ocio como
                                            la m??sica que se reproducir?? o la programaci??n de la
                                            televisi??n.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}

function AuthenticatedHome(props) {
    const classes = useStyles();
    const [paymentSuccess, setPaymentSuccess] = useState(props.history?.location.state?
        props.history.location.state.data : false)
    const [location, setLocation] = useState();
    const [error, setError] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setPaymentSuccess(false)
    };

    return (
        <div style={{marginBottom: "30px"}}>
            <Container component={"main"}>
                <CssBaseline/>
                <div>
                    <Container>
                        <div style={{marginTop: "30px"}}>
                            <img style={{
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto"
                            }} alt="logo" src={Logo} width="35%" height="35%"/>
                        </div>
                        <div className={classes.logContainer}>
                            <div className="typo">
                                <Typography
                                    variant="h6"
                                    align="center"
                                    color="textSecondary"
                                    paragraph
                                >
                                    ??En que zona desea buscar restaurantes?
                                </Typography>
                            </div>
                            <LocationSearch setError={setError} setLocation={setLocation}/>
                            {error === true && (
                                <p className="error">Error al obtener la direcci??n</p>
                            )}
                            <Map
                                setError={setError}
                                error={error}
                                setLocation={setLocation}
                                location={location}
                            />
                        </div>
                    </Container>
                </div>
            </Container>
            <Footer/>
            <Snackbar open={paymentSuccess} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    El pago se ha realizado correctamente
                </Alert>
            </Snackbar>
        </div>
    );

}



export default function Home(props) {
    const {isLogged} = useUser();

    return isLogged ? (
        <AuthenticatedHome history={props.history} />
    ) : (
        <Landing></Landing>
    );
}
