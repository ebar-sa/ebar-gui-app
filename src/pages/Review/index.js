import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from 'react-router';
import Container from "@material-ui/core/Container";
import Footer from "../../components/Footer";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Rating from "@material-ui/lab/Rating";
import TextField from "@material-ui/core/TextField";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useUser from "../../hooks/useUser";
import ReviewDataService from "../../services/review.service";
import CircularProgress from "@material-ui/core/CircularProgress";
import MesaDataService from "../../services/barTable.service";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import {ReportProblemOutlined} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "30px",
        marginBottom: "30px"
    },
    warning: {
        color: "#663c00",
        backgroundColor: "#fff4e5"
    }
}))

export default function Review(props) {
    const history = useHistory()
    const classes = useStyles()
    const { auth } = useUser()
    const [bar, setBar] = useState({})
    const [itemsData, setItemsData] = useState({})
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [emptySubmit, setEmptySubmit] = useState(false)
    const [incorrectSubmit, setIncorrectSubmit] = useState(false)
    const [axiosError, setAxiosError] = useState(false)
    const [formData, setFormData] = useState({})
    const token = props.match.params.tableToken

    useEffect(() => {
        setLoading(true)
        if (auth !== undefined && auth !== null &&
            auth.roles.includes('ROLE_CLIENT')) {
            ReviewDataService.getAvailableItemsToReview(token).then((res) => {
                if (res.status === 200) {
                    setLoading(false)
                    setItemsData(res.data)
                } else {
                    history.push('/pageNotFound');
                }
            }).catch(() => {
                history.push('/pageNotFound');
            })
        } else {
            history.push('/');
        }
    }, [auth, token, history])

    useEffect(() => {
        setLoading(true)
        MesaDataService.getBarClient(auth.username)
            .then((res) => {
                setBar(res.data)
                setFormData({barId: res.data.id, tableToken: token})
                setLoading(false)
            }).catch(() => {
                history.push('/pageNotFound');
        })
    }, [token, history, auth])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded? panel : false)
    }

    const handleRatingChange = (e, newValue) => {
        if (e.target.name === "rating-bar") {
            setFormData({...formData, bar: {
                ...formData.bar, rating: newValue, id: bar.id
                }})
        } else {
            let id = parseInt(e.target.name.replace("rating-", ""))
            setFormData({...formData, items: {
                ...formData.items, [id]: {
                        ...formData.items?.[id], rating: newValue
                    }
                }})
        }
    }

    const handleDescriptionChange = (e, id) => {
        if (id === null) {
            setFormData({...formData, bar: {
                    ...formData.bar, description: e.target.value, id: bar.id
                }})
        } else {
            setFormData({...formData, items: {
                    ...formData.items, [id]: {
                        ...formData.items?.[id], description: e.target.value
                    }
                }})
        }
    }

    const handleSubmit = () => {
        if(handleValidation()) {
            ReviewDataService.createReview(formData).then((res) => {
                if (res.status === 201) {
                    props.history.push({
                        pathname: "/mesas/detallesMesa/" + itemsData.tableId,
                        state: {
                            review: true
                        }
                    })
                } else {
                    setAxiosError(true)
                }
            }).catch((err) => {
                if(err.response?.status === 400) {
                    setIncorrectSubmit(true)
                } else if (err.response?.status === 404) {
                    setAxiosError(true)
                } else {
                    history.push('/pageNotFound');
                }
            })
        }
    }

    const handleValidation = () => {
        let valid = true
        if (formData.bar === undefined && formData.items === undefined) {
            valid = false
            setEmptySubmit(true)
        } else {
            if (formData.bar && (formData.bar.rating === null || formData.bar.rating === undefined)) {
                valid = false
                setIncorrectSubmit(true)
            } else if (formData.items) {
                for (const key in formData.items) {
                    if (formData.items?.[key].rating === null || formData.items?.[key].rating === undefined) {
                        valid = false
                        setIncorrectSubmit(true)
                        break
                    }
                }
            }
        }
        return valid
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setEmptySubmit(false)
        setIncorrectSubmit(false)
        setAxiosError(false)
    };

    return (
        <div style={{marginBottom: "30px"}}>
            {loading ?
                <div className='loading'>
                    <CircularProgress/>
                </div> :

                <Container component={"main"} maxWidth={"md"} className={classes.root}>
                    <Grid container spacing={1} justify={"center"} alignContent={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <Typography component="h1" variant="h4">
                                Nueva reseña
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <Typography component="h1" variant="h5">
                                Reseña del bar
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {itemsData.barReviewed &&
                            <Grid item xs={12}>
                                <Paper variant={"outlined"} className={classes.warning}>
                                    <Grid container spacing={1} style={{margin: "10px"}} alignContent="space-between" justify={"center"}>
                                        <Grid item>
                                            <ReportProblemOutlined style={{color: "#ffa016"}}/>
                                        </Grid>
                                        <Grid item>
                                            <Typography><strong>Aviso</strong></Typography>
                                        </Grid>
                                        <Grid item xs={12} align={"center"}>
                                            <Typography>Ya has realizado una reseña a este bar</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            }
                            {!itemsData.barReviewed &&
                            <Accordion expanded={expanded === 'bar'} onChange={handleChange('bar')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panelbar-content"
                                    id="panelbar-header"
                                >
                                    <Typography className={classes.heading}>{bar.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container justify={"center"} alignItems={"center"}>
                                        <Grid item xs={12}>
                                            <Typography component="legend" variant={"subtitle2"}>Valoración</Typography>
                                            <Rating name="rating-bar" defaultValue={0.} precision={0.5}
                                                    onChange={handleRatingChange}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField autoFocus fullWidth multiline
                                                       id="bar-review"
                                                       name={"bar-" + bar.id}
                                                       label="Descripción"
                                                       variant="outlined"
                                                       margin="normal"
                                                       onChange={(e) => handleDescriptionChange(e, null)}/>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            }
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <Typography component="h1" variant="h5">
                                Reseña de los ítems pedidos
                            </Typography>
                        </Grid>
                        {(!itemsData || !itemsData.items || itemsData.items.length === 0) &&
                        <Grid item xs={12}>
                            <Paper variant={"outlined"} className={classes.warning}>
                                <Grid container spacing={1} style={{margin: "10px"}} alignContent="space-between" justify={"center"}>
                                    <Grid item>
                                        <ReportProblemOutlined style={{color: "#ffa016"}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography><strong>Aviso</strong></Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <Typography>Ya has realizado una reseña a los ítems de la cuenta</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        }
                        {itemsData && itemsData.items && itemsData.items.length > 0 && itemsData.items.map((item, idx) => (
                            <Grid item xs={12}>
                                <Accordion expanded={expanded === 'item-' + item.id} onChange={handleChange('item-' + item.id)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls={"panel" + idx + "-content"}
                                        id={"panel" + idx + "-header"}
                                    >
                                        <Typography className={classes.heading}>{item.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container justify={"center"} alignItems={"center"}>
                                            <Grid item xs={12}>
                                                <Typography component="legend" variant={"subtitle2"}>Valoración</Typography>
                                                <Rating name={"rating-" + item.id} defaultValue={0.} precision={0.5}
                                                    onChange={handleRatingChange}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField autoFocus fullWidth multiline
                                                           id={"item" + item.id + "-review"}
                                                           name={"item-" + item.id}
                                                           label="Descripción"
                                                           variant="outlined"
                                                           margin="normal"
                                                           onChange={(e) => handleDescriptionChange(e, item.id)}/>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Grid container spacing={1} justify={"center"} alignItems={"center"} alignContent={"space-between"}>
                                <Grid item>
                                    {(!itemsData.barReviewed || (itemsData && itemsData.items &&
                                    itemsData.items.length > 0)) &&
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}>
                                        Enviar
                                    </Button>
                                    }
                                </Grid>
                                <Grid item>
                                    <Button
                                        href={"/#/mesas/detallesMesa/" + itemsData.tableId}
                                        type="submit"
                                        variant="contained"
                                        color="secondary">
                                        Volver a la mesa
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Container>
            }
            <Snackbar open={emptySubmit} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    No puedes enviar el formulario vacío
                </Alert>
            </Snackbar>
            <Snackbar open={incorrectSubmit} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    No se ha rellenado el formulario correctamente: si se rellena la descripción, la valoración es obligatoria
                </Alert>
            </Snackbar>
            <Snackbar open={axiosError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    Ha ocurrido un error al procesar la petición. Inténtelo de nuevo más tarde.
                </Alert>
            </Snackbar>
            <Footer/>
        </div>
    )


}