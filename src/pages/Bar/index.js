import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router';
import BarDataService from '../../services/bar.service';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import {green, red} from '@material-ui/core/colors';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import CarouselSlide from '../../components/CarouselSlide';
import {ChevronLeft, ChevronRight, InfoOutlined, ReportProblemOutlined, ErrorOutlineOutlined} from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';
import useUser from '../../hooks/useUser';
import EditIcon from '@material-ui/icons/Edit';
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    Snackbar,
    CssBaseline,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import MesaDataService from '../../services/barTable.service';
import Alert from '@material-ui/lab/Alert';
import BottomBar from '../../components/SimpleBottomNavigation';
import Footer from "../../components/Footer";
import Container from "@material-ui/core/Container";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Rating from '@material-ui/lab/Rating';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: "10px"
    },
    block: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: 'auto',
        minWidth: "100%",
    },
    bottomDivider: {
        borderBottom: '0.1em solid darkgray',
        lineHeight: '90%',
    },
    topBottomDivider: {
        borderTop: '0.1em solid darkgray',
        borderBottom: '0.1em solid darkgray',
        lineHeight: '85%',
    },
    barHeader: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: 'auto',
        marginBottom: '10px',
    },
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex',
    },
    buttons: {
        alignItems: 'stretch',
    },
    overflowHidden: {
        overflow: 'hidden',
    },
    hrColor: {
        borderTop: '1px solid darkgray',
    },
    snak: {
        marginBottom: '20px',
    },
    colorBar: {
        backgroundColor: 'white',
    },
    barClosed: {
        color: "#611a15",
        backgroundColor: "#fdecea"
    },
    barOpened: {
        color: "#214d6f",
        backgroundColor: "#e8f4fd"
    },
    barCloseToClosing: {
        color: "#663c00",
        backgroundColor: "#fff4e5"
    },
    gridMarginTop: {
        marginTop: "20px"
    }

}));

const logo = require('../../img/no-image.png');

function Arrow(props) {
    const {direction, clickFunction} = props;
    const icon = direction === 'left' ? <ChevronLeft/> : <ChevronRight/>;

    return (
        <div id={'arrow-' + direction} onClick={clickFunction}>
            {icon}
        </div>
    );
}

export default function Bar(props) {
    const history = useHistory();
    const classes = useStyles();
    const [token, setToken] = useState('');
    const [hasBarTable, setHasBarTable] = useState(false);
    const [barTable, setBarTable] = useState({});
    const [bar, setBar] = useState({
        avgRating: 0.
    });
    const [barState, setBarState] = useState('');
    const [index, setIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [shownReviews, setShownReviews] = useState([]);
    const [slideIn, setSlideIn] = useState(true);
    const [slideDirection, setSlideDirection] = useState('down');
    const [open, setOpen] = useState(false);
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false);
    const img =
        bar && bar.images && bar.images.length > 0 ? bar.images[index] : null;
    const imgsLength = bar && bar.images ? bar.images.length : 0;
    const barId = props.match.params.barId;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {auth, currentBar, updateCurrentBar} = useUser();
    let isOwner = bar && auth.username === bar.owner;
    const isEmployee = auth.roles.includes('ROLE_EMPLOYEE');
    const isClient = auth.roles.includes('ROLE_CLIENT');
    const pageLength = 5

    useEffect(() => {
        BarDataService.getBar(barId)
            .then((res) => {
                setBar(res.data);
                setShownReviews(getShownReviews(res.data.reviews, 1))
                setTotalPages(Math.ceil(res.data.reviews.length/pageLength))
            })
            .catch((error) => {
                // Http 402 -> Payment required
                if (error.response?.status === 402) {
                    history.push(`/payments/subscribe/${barId}`);
                } else {
                    console.log('Error: ' + error);
                    history.push('/pageNotFound');
                }
            });
    }, [barId, history]);

    useEffect(() => {
        let opening = bar.openingTime? new Date(bar.openingTime) : new Date()
        let openingMins = opening.getHours() * 60 + opening.getMinutes()
        let closing = bar.closingTime? new Date(bar.closingTime) : new Date()
        let closingMins = closing.getHours() * 60 + closing.getMinutes()
        let now = new Date();
        let nowMins = now.getHours() * 60 + now.getMinutes()
        if ((nowMins >= openingMins && nowMins <= closingMins) ||
            (openingMins >= closingMins && nowMins >= openingMins && nowMins >= closingMins) ||
            (openingMins >= closingMins && nowMins <= openingMins && nowMins <= closingMins)) {
            return Math.abs(nowMins - closingMins) > 60? setBarState("info") : setBarState("warning")
        } else {
            return setBarState("error")
        }
    }, [bar]);

    useEffect(() => {
        if (isClient && hasBarTable === false) {
            MesaDataService.getBarTableClient(auth.username)
                .then((res) => {
                    if (res.status === 200) {
                        setBarTable(res.data);
                        setHasBarTable(true);
                    } else {
                        setHasBarTable(false);
                    }
                })
                .catch((error) => {
                    setHasBarTable(false);
                    console.log('Error: ' + error);
                    history.push('/pageNotFound');
                });
        }
    }, [auth, history, isClient, hasBarTable]);

    const onArrowClick = (direction) => {
        const increment = direction === 'left' ? -1 : 1;
        const newIndex = (index + increment + imgsLength) % imgsLength;
        setIndex(newIndex);

        const oppDirection = direction === 'left' ? 'right' : 'left';
        setSlideDirection(direction);
        setSlideIn(false);

        setTimeout(() => {
            setIndex(newIndex);
            setSlideDirection(oppDirection);
            setSlideIn(true);
        }, 500);
    };

    function deleteCurrentImage() {
        if (auth.username === bar.owner) {
            BarDataService.deleteImage(barId, img.id)
                .then(() => {
                    let newBar = {...bar};
                    newBar.images = bar.images.filter((i) => i.id !== img.id);
                    setIndex(0);
                    setBar(newBar);
                })
                .catch();
        }

        setOpen(false);
    }

    function handleClickDelete() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setOpenSubmitIncorrect(false);
    }

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false);
    };

    function automaticOccupationWithToken() {
        if (token === '') {
            setOpenSubmitIncorrect(true);
        }
        MesaDataService.ocupateBarTableByToken(token.token, barId)
            .then((res) => {
                MesaDataService.getBarClient(auth.username).then((result) =>
                    updateCurrentBar(result.data)
                );
                if (res.status === 200) {
                    history.push(`/mesas/detallesMesa/${res.data.id}`);
                }
            })
            .catch((e) => {
                setOpenSubmitIncorrect(true);
                console.log(e);
            });
    }

    const handleChange = (event) => {
        setToken({...token, [event.target.name]: event.target.value});
    };

    const stateMessage = () => {
        if (barState === 'info') {
            return 'abierto'
        } else if (barState === 'warning') {
            return 'próximo a cerrar'
        } else {
            return 'cerrado'
        }
    }

    const barStateClassName = () => {
        if (barState === 'info') {
            return classes.barOpened
        } else if (barState === 'warning') {
            return classes.barCloseToClosing
        } else {
            return classes.barClosed
        }
    }

    const barStateIcon = () => {
        if (barState === 'info') {
            return <InfoOutlined style={{color: "#349ff3"}}/>
        } else if (barState === 'warning') {
            return <ReportProblemOutlined style={{color: "#ffa016"}}/>
        } else {
            return <ErrorOutlineOutlined style={{color: "#f45347"}}/>
        }
    }

    function getOpeningTime() {
        let openingTime = bar.openingTime? new Date(bar.openingTime) : new Date()
        return openingTime.getHours() + ":" + openingTime.getMinutes();
    }

    function getClosingTime() {
        let closingTime = bar.closingTime? new Date(bar.closingTime) : new Date()
        return closingTime.getHours() + ":" + (closingTime.getMinutes() === 0? "00" : closingTime.getMinutes());
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        setShownReviews(getShownReviews(bar.reviews, value));
    };

    const getShownReviews = (reviews, page) => {
        let toBeShown = []
        for (let i = page * pageLength - pageLength; i < page * pageLength; i++) {
            if (reviews.length <= i) {
                break
            }
            toBeShown.push(reviews[i])
        }

        return toBeShown
    }

    function anonymizeName(username) {
        return username.charAt(0) + "*".repeat(username.length - 2) + username.charAt(username.length - 1);
    }

    return (
        <div style={{marginBottom: "30px"}}>
            <Container component={"main"} maxWidth={"lg"} className={classes.root}>
                <CssBaseline/>
                <div className={classes.colorBar}>
                    <BottomBar props={true}/>
                </div>
                <Grid
                    container
                    spacing={1}
                    alignContent="space-between"
                    alignItems="center"
                    justify={'center'}
                >
                    <Grid item align="center">
                        <Typography component="h4" variant="h4" align="center">
                            {bar.name}
                        </Typography>
                    </Grid>
                    {isOwner && (
                        <Grid item>
                            <Button
                                startIcon={<EditIcon/>}
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    history.push('/bares/' + barId + '/update');
                                }}
                            >
                                Editar
                            </Button>
                        </Grid>
                    )}
                </Grid>

                <hr className={classes.hrColor}/>

                <Grid container className={classes.gridMarginTop} spacing={2} alignItems="center" justify="center">
                    <Grid item xs={12} sm={6} align="center">
                        {bar && bar.images && imgsLength > 0 ? (
                            <Grid
                                container
                                spacing={1}
                                alignItems="center"
                                justify="center"
                                className={classes.overflowHidden}
                            >
                                <Grid item xs={1} align={'center'}>
                                    <Arrow
                                        direction="left"
                                        clickFunction={() => onArrowClick('left')}
                                    />
                                </Grid>
                                <Grid item xs={10} align={'center'}>
                                    <Slide in={slideIn} direction={slideDirection}>
                                        <div>
                                            <CarouselSlide
                                                content={img}
                                                open={open}
                                                isOwner={isOwner}
                                                clickFunction={() => handleClickDelete()}
                                            />
                                        </div>
                                    </Slide>
                                </Grid>
                                <Grid item xs={1} align={'center'}>
                                    <Arrow
                                        direction="right"
                                        clickFunction={() => onArrowClick('right')}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <img alt="" src={logo.default}/>
                        )}
                    </Grid>

                    <Dialog
                        open={open}
                        fullScreen={fullScreen}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id={'responsive-dialog-title'}>
                            Eliminación de imagen
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                ¿Está seguro de que quiere eliminar esta imagen?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={deleteCurrentImage} color="primary">
                                Aceptar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Grid item xs={12} sm={6} align="center">
                        <Grid container spacing={1} justify={'center'}>
                            <Grid item xs={12}>
                                <Paper className={barStateClassName()}>
                                    <Grid container spacing={1} alignContent="space-between" justify={"center"}>
                                        <Grid item>
                                            {barStateIcon()}
                                        </Grid>
                                        <Grid item>
                                            <Typography><strong>Este bar se encuentra {stateMessage()}</strong></Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>El horario de apertura es de {getOpeningTime()} a {getClosingTime()}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper className={classes.block}>
                                    <Grid container spacing={1} justify={'center'}>
                                        <Grid item xs={12} className={classes.bottomDivider}>
                                            <Grid container justify={'center'}>
                                                <Grid item>
                                                    {barState !== 'error' && bar.freeTables > 0 ? (
                                                        <SvgIcon
                                                            style={{color: green[300]}}
                                                            component={CheckBoxIcon}
                                                            viewBox="0 0 24 18"
                                                        />
                                                    ) : (
                                                        <SvgIcon
                                                            style={{color: red[300]}}
                                                            component={CloseIcon}
                                                            viewBox="0 0 24 18"
                                                        />
                                                    )}
                                                </Grid>
                                                <Grid item>
                                                    <Typography component="h6" variant="h6" align="center">
                                                        Mesas disponibles: {barState === 'error'? 0 : bar.freeTables}/{bar.tables}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} className={classes.bottomDivider}>
                                            <Typography variant={'subtitle1'} align="center">
                                                {bar.location}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant={'body1'} align="center">
                                                {bar.description}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {isClient && barState !== 'error' && !hasBarTable && (
                        <Grid item xs={12}>
                            <Grid container spacing={1} justify={'center'}>
                                <Grid item xs={12}>
                                    <hr className={classes.hrColor}/>
                                    <Typography variant={'h6'} align="center">
                                        ¿Tienes un token? Introdúcelo y ocupa tu mesa:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <form>
                                        <Grid
                                            container
                                            alignItems="center"
                                            justify="center"
                                            spacing={1}
                                        >
                                            <Grid item xs={12} align="center">
                                                <TextField
                                                    required
                                                    id="token"
                                                    name="token"
                                                    label={'Token'}
                                                    variant={'outlined'}
                                                    InputLabelProps={{shrink: true}}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} align="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={(e) => automaticOccupationWithToken()}
                                                >
                                                    Enviar
                                                </Button>
                                                <hr className={classes.hrColor}/>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    <Grid item container xs={12}>
                        <ButtonGroup
                            fullWidth={true}
                            color="primary"
                            aria-label="outlined primary button group"
                            orientation={fullScreen ? 'vertical' : 'horizontal'}
                            className={classes.buttons}
                        >
                            {isClient &&
                            hasBarTable &&
                            currentBar !== undefined &&
                            currentBar.id === Number(barId) ? (
                                <Button href={`/#/mesas/detallesMesa/${barTable.id}`}>
                                    Tu mesa
                                </Button>
                            ) : null}
                            {isOwner || isEmployee ? (
                                <Button href={`/#/mesas/${barId}`}>Mesas</Button>
                            ) : null}
                            <Button href={`/#/bares/${barId}/menu`}>Carta</Button>
                            <Button href={`/#/bares/${barId}/votings`}>Votaciones</Button>
                            {bar && auth && bar.owner === auth.username && (
                                <Button href={`/#/bar/${barId}/employees`}>Empleados</Button>
                            )}
                        </ButtonGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant={'h6'} align="center">
                            Reseñas de clientes
                        </Typography>
                    </Grid>

                    <Grid item xs={12} align={"center"}>
                        <Grid container spacing={1} alignContent={"center"} alignItems={"flex-start"} justify={"center"}>
                            <Grid item>
                                <Rating value={bar.avgRating? bar.avgRating : 0.} precision={0.1} readOnly />
                            </Grid>
                            <Grid item>
                                <Typography>{" (" + bar.reviews?.length + ")"}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} align={"center"}>
                        <Grid container justify={"center"}>
                            <Paper className={classes.block}>
                                {shownReviews && shownReviews.length > 0?
                                <List>
                                    {shownReviews.map((review, idx) => (
                                        <Grid item xs={12}>
                                            <ListItem alignItems={"flex-start"}>
                                                <ListItemText
                                                    primary={<Rating value={review.value} precision={0.5} readOnly />}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textPrimary">
                                                                {review.description? review.description : ""}
                                                            </Typography>
                                                            {(review.description? " - " : "") + "Realizada por " + anonymizeName(review.creator.username)}
                                                        </React.Fragment>
                                                    }/>
                                            </ListItem>
                                            <Divider />
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <ListItem style={{display:'flex', justifyContent:'center'}}>
                                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                                        </ListItem>
                                    </Grid>
                                </List>
                                :
                                <Typography>
                                    No hay reseñas para este bar
                                </Typography>}
                            </Paper>
                        </Grid>
                    </Grid>

                    <div className={useStyles.snak}>
                        <Snackbar
                            open={openSubmitIncorrect}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackBar}
                        >
                            <Alert onClose={handleCloseSnackBar} severity="error">
                                El token no corresponde a ninguna mesa de este establecimiento
                            </Alert>
                        </Snackbar>
                    </div>
                </Grid>
            </Container>
            <Footer/>
        </div>
    );
}
