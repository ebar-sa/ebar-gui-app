import React, { useEffect, useState } from 'react';
import VotingDataService from "../../services/votings.service";
import { makeStyles } from '@material-ui/core/styles';
import '../../styles/create-voting.css'

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider ,KeyboardDateTimePicker } from "@material-ui/pickers";
import {AddCircle, Delete}from "@material-ui/icons";
import Alert from '@material-ui/lab/Alert';
import {TextField, Button, IconButton, Snackbar, Container, Grid, Typography} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

export default function CreateVotings(props){
    const classes = useStyles();
    const [state, setState] = useState('')
    const [now, setNow] = useState(new Date())
    const [errorOpen, setErrorOpen] = useState('')
    const [errorClose, setErrorClose] = useState('')
    const [openingHour, setOpeningHour] = useState(new Date(now.getTime() + 2 * 60000))
    const [closingHour, setClosingHour] = useState(new Date(now.getTime() + 60 * 60000))
    const [add, setAdd] = useState([])
    const [open, setOpen] = useState(false)
    const [openVal, setOpenVal] = useState(false)
    const [openSubmitCorrect, setOpenSubmitCorrect] = useState(false)
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const [errors, setErrors] = useState({})
    // useEffect(() => {
    //     VotingDataService.createVoting(1).then(res => {
    //         setVoting(res)
    //         console.log(res)
    //     }).catch(err => {
    //         console.log('Error', err.response.status)
    //     })
    // }, [])
    

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
            if (openingHour < now) {
                setErrorOpen('La fecha no puede estar en pasado')
            }
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [now, openingHour]);

    const handleSubmit = (evt) => {
        evt.preventDefault();

        if (handleValidation()) {
            const object = {
            "title": state.title, "description": state.description, "openingHour": formatDate(openingHour),
            "closingHour": formatDate(closingHour), "timer": 1, "options": add.map(index => {
                let _state = "option" + index;
                return { "description": state[_state], "votes": 0 }
            }), "votersUsernames": []
            }

            VotingDataService.createVoting(1, object).then(response => {
                if(response.status ===201){
                    setOpenSubmitCorrect(true)
                    props.history.push({ pathname: '/votings', state:{ data: openSubmitCorrect }});
                }else{
                    setOpenSubmitIncorrect(true)
                }
            }).catch(error => {
                setOpenVal(true)
                console.log("Error" + error)
            })
        } else {
            setOpenVal(true)
        }
        
        
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    const handleValidation = () => {
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
        }
        )

        setErrors(objectErrors);
        return formIsValid;
    }

    const handleDateOpenChange = (date) => {
        setOpeningHour(date);
        if (date === undefined || isNaN(date)){
            setErrorOpen('Fecha no válida')
        } else if (date < now) {
            setErrorOpen('La fecha no puede estar en pasado')
        }
        else{
            setErrorOpen('')
        }
    };

    const handleCloseChange = (date) => {   
        setClosingHour(date);
        if (isNaN(date)){
            setErrorClose('La fecha no es válida')
        }else if (date!=='' && date!=null && date < openingHour) {
            setErrorClose('La fecha de fin no puede ser anterior a la de inicio')
        } else if (date !== '' && date != null && date < now){
            setErrorClose('La fecha de fin no puede estar en pasado')
        }
        else {
            setErrorClose('')
        }
    };

    const addInputField = (event) => {
        if(add.length <=10){
        const size = add.length + 1;
        setAdd(prevState => [...prevState, size]);
        event.preventDefault();
        }else{
            setOpen(true) 
        }
    };

    const deleteInputField = (event) => {
        if (add.length > 0) {
            setAdd(add.slice(0, -1))
        } else {
            setOpen(true)
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setOpenVal(false)
        setOpenSubmitCorrect(false)
        setOpenSubmitIncorrect(false)
    };

    function formatDate(date) {
        if(date === null){
            return null
        }else{
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
        return dateStr+' '+timeStr;
        }
    }

    return(
        <Container fixed>
        <div style={{marginTop:'50px'}}>
            <Typography className='h5' variant="h5" gutterBottom>
                Creación de votación
            </Typography>
            <div style={{marginTop: '60px'}}>
                <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                    <Grid container spacing={0} justify="center" alignItems="center">
                    <Grid container justify="center" alignItems="center" item xs={6}>
                    <div>
                    <TextField className='input-title' id="title" label="Título" name="title" onChange={(e) => handleChange(e)}/>
                    <p className="p-style">{errors["title"]}</p>
                    </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" item xs={6}>
                    <div>
                        <TextField className='input-title' id="description" label="Descripción" name="description" onChange={(e) => handleChange(e)} multiline rows={4} variant="outlined"/>
                        <p className="p-style">{errors["description"]}</p>
                    </div>
                    </Grid>
                    </Grid>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={0} justify="center" alignItems="center">
                    <Grid container justify="center" alignItems="center" item xs={6}>
                    <div className='input-margin'>
                    <KeyboardDateTimePicker
                        ampm={false}
                        label="Fecha de inicio"
                        value={openingHour}
                        error={errorOpen !== ''}
                        onChange={handleDateOpenChange}
                        helperText={errorOpen}
                        onError={console.log}
                        minDate={new Date()}
                        minDateMessage="La fecha no puede estar en pasado"
                        invalidDateMessage="El formato de la fecha es incorrecto"
                        disablePast
                        format="dd-MM-yyyy HH:mm:ss"
                    />
                    </div >
                    </Grid>
                    <Grid container justify="center" alignItems="center"  item xs={6}>
                    <div className='input-margin'>
                    <KeyboardDateTimePicker
                        ampm={false}
                        label="Fecha de fin"
                        value={closingHour}
                        error={errorClose !== ''}
                        onChange={handleCloseChange}
                        helperText={errorClose}
                        onError={console.log}
                        minDate={new Date()}
                        minDateMessage="La fecha no puede estar en pasado"
                        invalidDateMessage="El formato de la fecha es incorrecto"
                        disablePast
                        format="dd-MM-yyyy HH:mm:ss"
                    />
                    </div>
                    </Grid>
                    </Grid>
                    </MuiPickersUtilsProvider>
                    <div className='input-margin'>
                        <Typography variant="h5" gutterBottom>
                            Opciones
                        </Typography>
                        <div className='buttons-margin'>
                        <IconButton onClick={(e) => addInputField(e)}>
                            <AddCircle /> 
                            <span style={{color: 'black', marginBottom: '4px', marginLeft:'4px', fontSize: '18px'}}>Añadir</span>
                        </IconButton>
                        <IconButton onClick={(e) => deleteInputField(e)}>
                            <Delete />
                            <span style={{ color: 'black', marginBottom: '4px', marginLeft: '4px', fontSize: '18px' }}>Eliminar</span>
                        </IconButton>
                        </div>
                        {add.map(index => {
                            return (
                                <div key={index}>
                                    <TextField
                                        className='input-title'
                                        id="option"
                                        label="Descripción"
                                        name={"option"+index}
                                        onChange={(e) => handleChange(e)}
                                        margin="normal"
                                    />
                                    <p className="p-style">{errors["option"+index]}</p>

                                </div>
                            );
                        })}
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ ...stylesComponent.buttonCrear }}>
                        Enviar
                    </Button> 
                    <div>
                        <Snackbar open={openSubmitIncorrect} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error">
                                Tienes que rellenar el formulario correctamente
                            </Alert>
                        </Snackbar>
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                No puedes crear o eliminar más opciones
                                </Alert>
                        </Snackbar>
                        <Snackbar open={openVal} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error">
                                Tienes que rellenar el formulario correctamente
                                </Alert>
                        </Snackbar>
                        
                    </div>
                </form>
            </div>
        </div>
        </Container>
    )
}

const stylesComponent = {
    buttonCrear: {
        backgroundColor: '#007bff',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        margin: 'auto',
        display: 'block',
        marginTop: '30px'
    }
}