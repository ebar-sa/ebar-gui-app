import React, {useState, useEffect, useCallback} from "react";
import BarDataService from "../../services/bar.service";
import { useHistory } from 'react-router';
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchRounded from "@material-ui/icons/SearchRounded";
import LinearProgress from "@material-ui/core/LinearProgress"
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfied from "@material-ui/icons/SentimentVerySatisfied";
import AddIcon from '@material-ui/icons/Add';
import useUser from "../../hooks/useUser";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: "10px",
        marginBottom: "100px"
    },
    list: {
        textAlign: 'left',
        margin: 'auto',
        backgroundColor: theme.palette.background.paper
    },
    title: {
        padding: "30px",
        paddingBottom: "40px"
    },
    searchBar: {
        width: "100%",
        marginBottom: "15px"
    },
}))

var options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0
};

export default function BarList(props) {

    const classes = useStyles()
    const [bars, setBars] = useState([])
    const history = useHistory()
    const { auth } = useUser()
    const [searchValue, setSearchValue] = useState("")
    const [currentLocation, setCurrentLocation] = useState()
    const [loading, setLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [showLocationAlert, setShowLocationAlert] = useState(false)
    const [searchDisabled, setSearchDisabled] = useState(true)

    const setStartLoc = useCallback(() => {
        return new Promise(function (resolve, reject) {    
            if (navigator && navigator.geolocation) {
                setShowLocationAlert(true)
                setSearchDisabled(true)
                return navigator.geolocation.getCurrentPosition(
                    pos => {
                        setShowLocationAlert(false)
                        setSearchDisabled(false)
                        return resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    },
                    err => { 
                        setShowLocationAlert(false)
                        setSearchDisabled(false)
                        return resolve({ lat: null, lng: null });
                    }
                ,options);
            }
            setShowLocationAlert(false)
            return resolve({ lat: null, lng: null });
        });
    }, [])

    const searchBar = useCallback(() => {
        setIsSearching(true)
        BarDataService.searchBars(searchValue, currentLocation )
            .then(res => {
                if (res.status === 200){
                    setBars(res.data)
                }
                setIsSearching(false)
            }).catch(err => {
                console.log(err)
                setIsSearching(false)
            })
    }, [searchValue, currentLocation])

    const showEntireList = useCallback(() => {
        setLoading(true)
        BarDataService.getAllWithCapacity(currentLocation)
            .then(res => {
                if (res.status === 200){
                    setBars(res.data)
                }
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
    }, [currentLocation])

    const formatDistance = (meters) => {
        const truncated = Math.trunc(meters)
        let res = ""

        if (truncated.toString().length > 3) {
            res = (truncated/1000).toFixed(2) + " kilometros"
        } else {
            res = truncated.toString() + " metros"
        }

        return res
    }

    useEffect(() => {
        setStartLoc()
            .then(startLoc => {
                setCurrentLocation(startLoc)
            }).catch(err =>
                console.log(err))
    }, [setCurrentLocation, setStartLoc]);

    useEffect(() => {
        if (searchValue.length >= 3) {
            searchBar()
        } else if (searchValue.length === 0) {
            showEntireList()
        } else if (searchValue.length > 0 && searchValue.length < 3) {
            setBars([])
        }
    }, [searchValue, currentLocation, searchBar, showEntireList])

    const showTitle = () => {
        if (auth.roles.includes('ROLE_CLIENT')) {
            return <Grid item>
                        <Typography className={classes.title} component={"h4"} variant={"h4"} align={"center"}>Lista de bares disponibles</Typography>
                    </Grid>
        } else if (auth.roles.includes('ROLE_OWNER') || auth.roles.includes('ROLE_EMPLOYEE')){
            return <Grid item>
                        <Typography className={classes.title} component={"h4"} variant={"h4"} align={"center"}>Mis bares</Typography>
                    </Grid>
        }
    }

    const showList = () => {
        if (bars.length > 0) {
            return <Paper className={classes.container}>
                        <List component={"nav"} className={classes.list}>
                            {bars  && bars.map((bar, idx) => (
                                <div key={bar.id}>
                                    <ListItem button component={Link} to={"/bares/" + bar.id}>
                                        <ListItemText
                                            primary={bar.name}
                                            secondary={"Mesas disponibles: " + bar.capacity}/>
                                        {bar.distance ? <Typography data-testid={"distance"+bar.id} variant="caption">A {formatDistance(bar.distance)}</Typography> : "" }
                                    </ListItem>
                                    {bars.length > (idx+1) ? <Divider /> : ""}
                                </div>
                                ))}
                        </List>
                    </Paper>
        } else if (searchValue.length < 3 && searchValue.length > 0 && !loading && !showLocationAlert) {
            return <Alert data-testid="less_than_three_alert" severity="info">
                        <AlertTitle>Haz una búsqueda con al menos 3 carácteres para mostrar los resultados entre todos los bares.</AlertTitle>
                        Si la barra de búsqueda está vacía y nos has dado los permisos necesarios se te mostrarán los 15 bares más cercanos.
                    </Alert>
        } else if ( !loading && !isSearching && !showLocationAlert ){
            return <Alert data-testid="no_result_alert" severity="error" icon={<SentimentVeryDissatisfiedIcon fontSize="inherit" />}> No se han encontrado resultados </Alert>
        } else if ( showLocationAlert ) {
            return <Alert data-testid="location_alert" severity="info">
                        <AlertTitle>Acepta (o rechaza) los permisos de ubicación del navegador</AlertTitle>
                        ¡Si los aceptas podremos enseñarte tus bares más cercanos!
                        Si ya has seleccionado una opción <strong>espera unos segundos</strong> <SentimentVerySatisfied/>
                    </Alert>
        }
    }

    const showAddBarButton = () => {
        if (auth.roles.includes('ROLE_OWNER')){
            return  <Grid item>
                        <Button
                            startIcon={<AddIcon/>}
                            type="button"
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                history.push("/bares/create")
                            }}>
                            Añadir nuevo bar
                        </Button>
                    </Grid>
        } else {
            return ""
        }     
    }

    return (
        <Container 
            component="div" maxWidth="sm" className={classes.container}>
            <LinearProgress hidden={!loading} />
            <Grid container spacing={1} alignContent="space-between" alignItems="center" justify={"center"}>
                {showTitle()}
                {showAddBarButton()}
            </Grid>

            <Grid item>
                <TextField
                    data-testid="search_bar"
                    className = {classes.searchBar} 
                    id="input-with-icon-grid"
                    variant="standard"
                    label="Buscar entre los bares" 
                    disabled={searchDisabled}
                    onChange={(evt) => setSearchValue(evt.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <SearchRounded />
                            </InputAdornment>
                        ),
                    }} 
                />
            </Grid>
            {showList()}
        </Container>
    );
}
