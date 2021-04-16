import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import BarDataService from "../services/bar.service";

const useStyles = makeStyles(() => ({

    root: {
        padding: "10px",
        marginBottom: "100px"
    },
    inputFile: {
        display: "none"
    },
    maxWidthImg: {
        maxWidth: "150px"
    },
    title: {
        paddingTop: "15px"
    },
    form: {
        paddingTop: "15px"
    }
}))

export default function BarForm(props) {
    const classes = useStyles()
    const [state, setState] = useState({
        name: '',
        description: '',
        location: '',
        contact: ''
    })
    const [openingTime, setOpeningTime] = useState(new Date().getTime())
    const [closingTime, setClosingTime] = useState(new Date().getTime())
    const [selectedFiles, setSelectedFiles] = useState([])
    const [openingTimeError, setOpeningTimeError] = useState('')
    const [closingTimeError, setClosingTimeError] = useState('')
    const [errors, setErrors] = useState({})
    const [axiosError, setAxiosError] = useState(false)
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)

    useEffect( () => {
        setState(props.bar)
        setOpeningTime(props.openingTime)
        setClosingTime(props.closingTime)
    }, [props.bar, props.openingTime, props.closingTime])

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
        setErrors({})
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        if (handleValidation()) {
            let object = {
                "name": state.name,
                "description": state.description,
                "contact": state.contact,
                "location": state.location,
                "openingTime": formatTime(openingTime),
                "closingTime": formatTime(closingTime),
                "images": selectedFiles.map(file => {
                    return file
                })
            }

            if (props.type === 'create') {
                BarDataService.createBar(object).then(response => {
                    if (response.status === 201) {
                        props.history.push({
                            pathname: response.headers["location"],
                            state: {
                                data: true
                            }
                        })
                    } else {
                        setOpenSubmitIncorrect(true)
                    }
                }).catch(error => {
                    console.log("Error" + error)

                })
            } else {
                BarDataService.updateBar(object, props.barId).then(res => {
                    if (res.status === 200) {
                        props.history.push({
                            pathname: "/bares/" + props.barId,
                            state: {
                                data: true
                            }
                        })
                    } else {
                        setOpenSubmitIncorrect(true)
                    }
                })
            }


        } else {
            setOpenSubmitIncorrect(true)
        }
    }


    function handleValidation() {
        let valid = openingTimeError === '' && closingTimeError === ''
        let objErrors = {}
        if (!state.name) {
            valid = false
            objErrors["name"] = "El nombre del bar no puede estar vacío"
        }
        if (!state.description) {
            valid = false
            objErrors["description"] = "La descripción del bar no puede estar vacía"
        }
        if (!state.contact) {
            valid = false
            objErrors["contact"] = "La información de contacto del bar no puede estar vacía"
        }
        if (!state.location) {
            valid = false
            objErrors["location"] = "La dirección del bar no puede estar vacía"
        }
        setErrors(objErrors)
        return valid
    }

    function formatTime(time) {
        let result = null
        if (time !== null) {
            let d = new Date(time.getTime() + 60000 * time.getTimezoneOffset())
            let hour = d.getHours()
            let minute = d.getMinutes()

            if (hour.toString().length < 2) {
                hour = '0' + hour;
            }
            if (minute.toString().length < 2) {
                minute = '0' + minute;
            }

            result = '1970-01-01T' + [hour, minute, '00'].join(':') + ".000+00:00"
            return result
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAxiosError(false)
        setOpenSubmitIncorrect(false)
    };

    const handleOpeningTimeChange = (time) => {
        setOpeningTime(time)
        if (time === undefined || isNaN(time) || time === null) {
            setOpeningTimeError("La hora no es válida")
        } else {
            setOpeningTimeError("")
        }
    }

    const handleClosingTimeChange = (time) => {
        setClosingTime(time)
        if (time === undefined || isNaN(time) || time === null) {
            setClosingTimeError("La hora no es válida")
        } else {
            setClosingTimeError("")
        }
    }

    const selectFile = (e) => {
        Array.from(e.target.files).forEach(f => {
            const fr = new FileReader()
            fr.onload = () => {
                let blob = btoa(fr.result)
                console.log(blob)
                let object = {
                    "fileName": f.name,
                    "fileType": f.type,
                    "data": blob
                }
                setSelectedFiles(prevFiles => [...prevFiles, object])
            }
            fr.readAsBinaryString(f)

        })

    }

    return (
        <Container className={classes.root}>
            <div className={classes.title}>
                <Typography className='h5' variant="h5" gutterBottom>
                    {props.type === 'create'? 'Creación' : 'Actualización'} de un bar
                </Typography>
            </div>
            <div className={classes.form}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Grid container alignItems="center" justify="center" spacing={1}>
                        <Grid item xs={12} align="center">
                            <TextField fullWidth required
                                       id={"name"}
                                       name={"name"}
                                       label={'Nombre'}
                                       value={state.name}
                                       error={errors.name !== null && errors.name !== undefined && errors.name !== ''}
                                       helperText={errors.name}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={(e) => handleChange(e)}/>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField fullWidth required multiline
                                       id={"description"}
                                       name={"description"}
                                       label={'Descripción'}
                                       value={state.description}
                                       error={errors.description !== null && errors.description !== undefined && errors.description !== ''}
                                       helperText={errors.description}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={(e) => handleChange(e)}/>
                        </Grid>
                        <Grid item xs={12} sm={6} align="center">
                            <TextField fullWidth required
                                       id={"contact"}
                                       name={"contact"}
                                       label={'Contacto'}
                                       value={state.contact}
                                       error={errors.contact !== null && errors.contact !== undefined && errors.contact !== ''}
                                       helperText={errors.contact}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={(e) => handleChange(e)}/>
                        </Grid>
                        <Grid item xs={12} sm={6} align="center">
                            <TextField fullWidth required
                                       id={"location"}
                                       name={"location"}
                                       label={'Dirección'}
                                       value={state.location}
                                       error={errors.location !== null && errors.location !== undefined && errors.location !== ''}
                                       helperText={errors.location}
                                       variant={"outlined"}
                                       InputLabelProps={{ shrink: true }}
                                       onChange={(e) => handleChange(e)}/>
                        </Grid>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid item xs={12} sm={6} align="center">
                                <KeyboardTimePicker
                                    id={"opening"}
                                    label={"Hora de apertura"}
                                    ampm={false}
                                    value={openingTime}
                                    error={openingTimeError !== ''}
                                    helperText={openingTimeError}
                                    onChange={handleOpeningTimeChange}/>
                            </Grid>
                            <Grid item xs={12} sm={6} align="center">
                                <KeyboardTimePicker
                                    id={"closing"}
                                    label={"Hora de cierre"}
                                    ampm={false}
                                    value={closingTime}
                                    error={closingTimeError !== ''}
                                    helperText={closingTimeError}
                                    onChange={handleClosingTimeChange}/>
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <Grid item xs={12} align="center">
                            <input
                                accept="image/*"
                                id="contained-button-file"
                                multiple
                                type="file"
                                className={classes.inputFile}
                                data-testid={"prueba"}
                                onChange={selectFile}
                            />
                            <Typography className='p' variant="subtitle1" gutterBottom>
                                Subida de imágenes
                            </Typography>
                            <label htmlFor="contained-button-file">


                                <Button variant="contained" component="span">
                                    Subir imágenes
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <List component="nav" aria-label="main mailbox folders">
                                {(selectedFiles && selectedFiles.length > 0) ? selectedFiles.map((file, ix) => (
                                    <ListItem
                                        divider
                                        key={ix}>
                                        <Grid container alignItems="center" justify="center" spacing={2}>
                                            <Grid item xs={12} sm={12} md={6}>
                                                <Grid container alignItems="center" justify="center" spacing={1}>
                                                    <Grid item xs={12} align="center">
                                                        <Typography className='p' variant="subtitle1" gutterBottom>
                                                            {file.fileName}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} align="center">
                                                        <img alt="" src={"data:" + file.fileType + ";base64," + file.data} className={classes.maxWidthImg}/>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} align="center">
                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<DeleteIcon/>}
                                                    onClick={() => {
                                                        let imageToDelete = selectedFiles[ix]
                                                        setSelectedFiles(selectedFiles.filter(f => f !== imageToDelete))
                                                    }}>
                                                    Eliminar
                                                </Button>
                                            </Grid>
                                        </Grid>


                                    </ListItem>
                                )) : ''}
                            </List>
                        </Grid>

                        <Grid item xs={12} align="center">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary">
                                Enviar
                            </Button>
                        </Grid>
                    </Grid>
                    <div>
                        <Snackbar open={openSubmitIncorrect} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error">
                                Tienes que rellenar el formulario correctamente
                            </Alert>
                        </Snackbar>
                        <Snackbar open={axiosError} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error">
                                Ha ocurrido un error al procesar la petición. Inténtelo de nuevo más tarde.
                            </Alert>
                        </Snackbar>

                    </div>
                </form>
            </div>
        </Container>
    )
}