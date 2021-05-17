import {
    IconButton, Button, LinearProgress, Snackbar, Container, Typography, TextField, Grid, Dialog, DialogActions,
    DialogContent, DialogTitle, DialogContentText
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router"
import {makeStyles} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import {AddCircle, Cancel, Delete, Send} from "@material-ui/icons";
import useUser from '../../hooks/useUser'
import VotingDataService from "../../services/votings.service";
import DateFnsUtils from '@date-io/date-fns';
import BarDataService from "../../services/bar.service";
import Footer from "../../components/Footer";


const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

function EditVoting(props) {

    const classes = useStyles();
    const barId = props.match.params.idBar
    const votingId = props.match.params.votingId

    const [progressBarHidden, setProgressBarHidden] = useState(false)
    const [voting, setVoting] = useState({})
    const [state, setState] = useState({})
    const [showPublishedVotingAlert, setShowPublishedVotingAlert] = useState(false)
    const [showErrorFormAlert, setShowErrorFormAlert] = useState(false)
    const [showMaxOptionsAlert, setShowMaxOptionsAlert] = useState(false)
    const [showVoting, setShowVoting] = useState(false)
    const [errorOpen, setErrorOpen] = useState('')
    const [errorClose, setErrorClose] = useState('')
    const [add, setAdd] = useState([])
    const [errors, setErrors] = useState({})
    const [now, setNow] = useState(new Date())
    const [showContent, setShowContent] = useState(false)

    const history = useHistory()
    const {auth} = useUser()

    function formatDateToString(date) {
        if (date === null) {
            return null
        } else {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear(),
                hour = d.getHours(),
                minutes = d.getMinutes(),
                sec = d.getSeconds();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            if (hour.toString().length < 2)
                hour = '0' + hour;
            if (minutes.toString().length < 2)
                minutes = '0' + minutes;
            if (sec.toString().length < 2)
                sec = '0' + sec;

            const dateStr = [day, month, year].join('-');
            const timeStr = [hour, minutes, sec].join(':')
            return dateStr + ' ' + timeStr;
        }
    }

    function formatStringToDate(date) {
        if (!date) {
            return null
        } else {
            const dateSplit = date.split(' ')[0].split('-')
            const hourSplit = date.split(' ')[1].split(':')

            const day = dateSplit[0]
            const month = dateSplit[1]
            const anno = dateSplit[2]

            const hour = hourSplit[0]
            const minutes = hourSplit[1]
            const seconds = hourSplit[2]

            return new Date(anno, month - 1, day, hour, minutes, seconds)
        }
    }

    const handleCloseDialog = () => {
        setShowContent(false);
    };

    useEffect(() => {
        BarDataService.getBar(barId).then(res => {
            let owner = res.data.owner;
            let emp = res.data.employees.map(a => a.username)
            if (!(owner === auth.username || emp.includes(auth.username))) history.push('/')
        }).catch(err => {
            history.push('/pageNotFound')
        })
    }, [barId, history, auth.username])


    useEffect(() => {
        VotingDataService.getVoting(votingId, auth.accessToken)
            .then((res) => {
                if (res && res.id === parseInt(votingId)) {
                    let initAdd = []
                    let initialState = {
                        title: res.title,
                        description: res.description,
                        openingHour: formatStringToDate(res.openingHour),
                        closingHour: formatStringToDate(res.closingHour),
                    }

                    for (let i = 1; i <= res.options.length; i++) {
                        let key = "option" + i
                        initAdd = [...initAdd, i]
                        initialState = {...initialState, [key]: res.options[i - 1].description}
                    }

                    setState(
                        initialState
                    )

                    setAdd(initAdd)
                    setVoting(res)
                } else {
                    history.push('/pageNotFound/')
                }
            })
    }, [auth.accessToken, votingId, history])

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
            if (formatStringToDate(voting.openingHour) < now) {
                setShowPublishedVotingAlert(true)
                setProgressBarHidden(true)
                setShowVoting(false)
            } else {
                setShowVoting(true)
                setProgressBarHidden(true)
            }
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [voting, now])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowPublishedVotingAlert(false)
        setShowMaxOptionsAlert(false)
        setShowErrorFormAlert(false)
    };

    const handleFormValidation = () => {
        let formIsValid = true;
        let objectErrors = {}

        if (!state.title) {
            formIsValid = false;
            objectErrors["title"] = "No puede estar vacío";
        }

        if (!state.description) {
            formIsValid = false;
            objectErrors["description"] = "No puede estar vacío";
        }

        add.forEach(index => {
            let _state = "option" + index;
            if (!state[_state]) {
                formIsValid = false;
                objectErrors["option" + index] = "No puede estar vacío";
            }
            return null;
        })

        setErrors(objectErrors);
        return formIsValid;
    }

    const handleFormSubmit = (evt) => {
        evt.preventDefault()

        if (handleFormValidation()) {
            const object = {
                "title": state.title,
                "description": state.description,
                "openingHour": formatDateToString(state.openingHour),
                "closingHour": formatDateToString(state.closingHour),
                "timer": 1,
                "options": add.map(index => {
                    let _state = "option" + index
                    return {
                        "description": state[_state],
                        "votes": 0,
                    }
                }),
                "votersUsernames": voting.votersUsernames
            }

            VotingDataService.updateVoting(barId, voting.id, object)
                .then(res => {
                    if (res.status === 200) {
                        props.history.push({pathname: '/bares/' + barId + '/votings', state: {edit: true}})
                    } else {
                        setShowErrorFormAlert(true)
                    }
                }).catch(exc => {
                history.push('/pageNotFound')
            })
        } else {
            setShowErrorFormAlert(true)
        }
    }

    const handleChange = (evt) => {
        setState({...state, [evt.target.name]: evt.target.value})
    }

    const handleDelete = (evt) => {
        VotingDataService.deleteVoting(barId, voting.id)
            .then(res => {
                if (res.status === 200) {
                    props.history.push({pathname: '/bares/' + barId + '/votings', state: {delete: true}})
                } else {
                    setShowErrorFormAlert(true)
                }
            }).catch(exc => {
            history.push('/pageNotFound')
        })
    }

    const handleDateOpenChange = (date) => {

        setState({...state, openingHour: date})

        if (date === undefined || isNaN(date) || !date) {
            setErrorOpen('Fecha no válida')
        } else if (date < formatDateToString(now)) {
            setErrorOpen('La fecha no puede estar en pasado')
        } else {
            setErrorOpen('')
        }
    };

    const addInputField = (event) => {
        if (add.length <= 10) {
            const size = add.length + 1;
            setAdd(prevState => [...prevState, size]);
            event.preventDefault();
        } else {
            setShowMaxOptionsAlert(true)
        }
    }

    const deleteInputField = (event) => {
        if (add.length > 0) {
            setAdd(add.slice(0, -1))
            let auxKey = "option" + add[add.length - 1]
            delete state[auxKey]
        } else {
            setShowMaxOptionsAlert(true)
        }
    }

    const handleCloseChange = (date) => {

        setState({...state, closingHour: date});

        if (isNaN(date) || date === '' || date === undefined || !date) {
            setErrorClose('Fecha no válida')
        } else if (date !== '' && date != null && date < state.openingHour) {
            setErrorClose('La fecha de fin no puede ser anterior a la de inicio')
        } else if (date !== '' && date != null && date < now) {
            setErrorClose('La fecha de fin no puede estar en pasado')
        } else {
            setErrorClose('')
        }
    };

    return (
        <div>
            <LinearProgress hidden={progressBarHidden}/>
            {showVoting ?
                <div style={{marginBottom: '30px'}}>
                    <Container fixed>
                        <div style={{marginTop: '50px', marginBottom: '30px'}}>
                            <Typography className='h5' variant="h5" gutterBottom>
                                Edición de votación
                            </Typography>
                            <div style={{marginTop: '60px'}}>
                                <form onSubmit={(evt) => handleFormSubmit(evt)} className={classes.root}>
                                    <Grid container justify="center" alignItems="center">
                                        <div>
                                            <TextField data-testid="titleField" className='input-title'
                                                       value={state.title}
                                                       id="title" label="Título" name="title"
                                                       onChange={(e) => handleChange(e)}/>
                                            <p className="p-style">{errors["title"]}</p>
                                        </div>
                                    </Grid>

                                    <Grid direction="column" style={{marginTop: '10px'}} container justify="center"
                                          alignItems="center">
                                        <TextField data-testid="descriptionField" className='input-title'
                                                   value={state.description} id="description" label="Descripción"
                                                   name="description" onChange={(e) => handleChange(e)} multiline
                                                   rows={4} variant="standard"/>
                                        <p className="p-style">{errors["description"]}</p>
                                    </Grid>

                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="center" alignItems="center">
                                            <div className='input-margin'>
                                                <KeyboardDateTimePicker
                                                    data-testid="openingField"
                                                    id="opening"
                                                    ampm={false}
                                                    label="Fecha de inicio"
                                                    value={state.openingHour}
                                                    error={errorOpen !== ''}
                                                    onChange={handleDateOpenChange}
                                                    helperText={errorOpen}
                                                    onError={console.log}
                                                    minDate={new Date()}
                                                    minDateMessage="La fecha no puede estar en pasado"
                                                    invalidDateMessage="El formato de la fecha es incorrecto"
                                                    disablePast
                                                    format="dd-MM-yyyy HH:mm:ss"/>
                                            </div>
                                        </Grid>

                                        <Grid container justify="center" alignItems="center">
                                            <div className='input-margin'>
                                                <KeyboardDateTimePicker
                                                    data-testid="closingField"
                                                    id="closing"
                                                    ampm={false}
                                                    label="Fecha de fin"
                                                    value={state.closingHour}
                                                    error={errorClose !== ''}
                                                    onChange={handleCloseChange}
                                                    helperText={errorClose}
                                                    onError={console.log}
                                                    minDate={new Date()}
                                                    minDateMessage="La fecha no puede estar en pasado"
                                                    invalidDateMessage="El formato de la fecha es incorrecto"
                                                    disablePast
                                                    format="dd-MM-yyyy HH:mm:ss"/>
                                            </div>
                                        </Grid>
                                    </MuiPickersUtilsProvider>

                                    <div className='input-margin'>
                                        <Typography variant="h5" gutterBottom>
                                            Opciones
                                        </Typography>
                                        <div className='buttons-margin'>
                                            <IconButton onClick={(e) => addInputField(e)}>
                                                <AddCircle/>
                                                <span style={{
                                                    color: 'black',
                                                    marginBottom: '4px',
                                                    marginLeft: '4px',
                                                    fontSize: '18px'
                                                }}>Añadir</span>
                                            </IconButton>
                                            <IconButton onClick={(e) => deleteInputField(e)}>
                                                <Delete/>
                                                <span style={{
                                                    color: 'black',
                                                    marginBottom: '4px',
                                                    marginLeft: '4px',
                                                    fontSize: '18px'
                                                }}>Eliminar</span>
                                            </IconButton>
                                        </div>
                                        {add.map(index => {
                                            return (
                                                <div key={index}>
                                                    <TextField
                                                        data-testid={"option" + index}
                                                        className='input-title'
                                                        id={"option" + index}
                                                        label="Descripción"
                                                        name={"option" + index}
                                                        value={state["option" + index.toString()] || ''}
                                                        onChange={(e) => handleChange(e)}
                                                        margin="normal"/>
                                                    <p className="p-style">{errors["option" + index]}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div>
                                        <Grid container
                                              direction="row"
                                              justify="center"
                                              alignItems="center" spacing={3}>
                                            <Grid item>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    style={{...stylesComponent.buttonCrear}}
                                                    startIcon={<Send/>}>
                                                    Guardar
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    onClick={() => setShowContent(true)}
                                                    variant="contained"
                                                    style={{...stylesComponent.buttonDiscard}}
                                                    startIcon={<Cancel/>}>
                                                    Descartar
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => history.goBack()}
                                            style={{...stylesComponent.buttonVolver}}>
                                            Volver
                                        </Button>
                                    </div>

                                    <Snackbar open={showMaxOptionsAlert} autoHideDuration={6000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity="warning">
                                            No puedes crear o eliminar más opciones
                                        </Alert>
                                    </Snackbar>

                                    <Snackbar open={showErrorFormAlert} autoHideDuration={6000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity="error">
                                            Tienes que rellenar el formulario correctamente
                                        </Alert>
                                    </Snackbar>

                                    <Dialog open={showContent} onClose={handleCloseDialog}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description">
                                        <DialogTitle id="alert-dialog-title">{"Eliminar votación"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                ¿Estas seguro de que deseas borrar la votación?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseDialog} color="primary">
                                                Atrás
                                            </Button>
                                            <Button onClick={handleDelete} color="primary" autoFocus>
                                                Aceptar
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </form>
                            </div>
                        </div>
                    </Container>
                    <Footer/>
                </div>
                :
                <div>
                    {showPublishedVotingAlert &&
                        <Alert icon={false} severity="warning">
                            No puedes editar votaciones ya comenzadas
                        </Alert>
                    }
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => history.goBack()}
                        style={{...stylesComponent.buttonVolver}}>
                        Volver
                    </Button>
                </div>
            }
        </div>
    )
}

const stylesComponent = {
    buttonCrear: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        marginTop: '10px'
    },
    buttonVolver: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        margin: 'auto',
        display: 'block',
        marginTop: '30px'
    },
    buttonDiscard: {
        backgroundColor: '#d53249',
        color: 'white',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        marginTop: '10px'
    }
}

export default EditVoting

