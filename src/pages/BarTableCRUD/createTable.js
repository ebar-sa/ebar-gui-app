import React, {useState,useEffect } from 'react';
import BarTableService from "../../services/barTable.service";
import { makeStyles } from '@material-ui/core/styles';
import '../../styles/create-voting.css'
import Alert from '@material-ui/lab/Alert';
import {TextField, Button, Snackbar, Container, Grid, Typography} from '@material-ui/core';
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

export default function BarTableCreate(){
    const classes = useStyles();
    const [state, setState] = useState('')
    const id = useParams();
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const { auth } = useUser()
    const admin = auth.roles.includes('ROLE_OWNER') || auth.roles.includes('ROLE_EMPLOYEE');
    useEffect(() => {
        if (!admin) history.push('/pageNotFound')
    }, [admin, history])

    const handleSubmit = (evt) => {
        evt.preventDefault();
            if(state.name === undefined || state.name === "" || state.seats === undefined ){
                setOpenSubmitIncorrect(true)
            }else{
                const object = {
                    "name": state.name, "seats":parseInt(state.seats)
                }
                BarTableService.createBarTable(id, object).then(response => {
                    if(response.status ===201){
                        history.push({ pathname: '/mesas/' + id.id, state:{ data: true }});
                    }else{
                        setOpenSubmitIncorrect(true)
                    }
                }).catch(error => {
                    console.log("Error" + error)
                })    
            }
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false)
    };

    return (
       
        <Container fixed>
            <div style={{ marginTop: '50px', marginBottom: '100px'}}>
            <Typography className='h5' variant="h5" gutterBottom>
                Creación de Mesa
            </Typography>
            <div style={{marginTop: '60px'}}>
                <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                    <Grid container justify="center" alignItems="center" >
                    <div>
                    <TextField className='input-title' id="name" label="Nombre" name="name" onChange={(e) => handleChange(e)}/>
                    </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                    <div style={{marginTop: '20px'}}>
                        <TextField className='input-title' type="number" inputprops={{inputProps: { max: 10, min: 0 }}} id="seats" label="Sillas" name="seats"aria-describedby="Seats" onChange={(e) => handleChange(e)}/>
                    </div>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ ...stylesComponent.buttonCrear }}>
                        Enviar
                    </Button> 
                    <div className={stylesComponent.snak}>
                        <Snackbar  open={openSubmitIncorrect} autoHideDuration={6000} onClose={handleClose}>
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
    },
    snak: {
        marginBottom: '20px',
    }
}