import React, {useState,useEffect } from 'react';
import BarTableService from "../../services/mesa.service";
import { makeStyles } from '@material-ui/core/styles';
import '../../styles/create-voting.css'
import Alert from '@material-ui/lab/Alert';
import {Button, Snackbar, Container, Grid, Typography, FormControl, InputLabel, Input} from '@material-ui/core';
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

export default function BarTableUpdate(){
    const classes = useStyles();
    const params = useParams();
    const id = params.id;
    const idBar = params.idBar;
    const [barTable,setBarTable] = useState({name: '', seats:0});
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const { auth } = useUser()
    const admin = auth.roles.includes('ROLE_OWNER') || auth.roles.includes('ROLE_EMPLOYEE');
    
    useEffect(() => {
        if (!admin) history.push('/pageNotFound')
    }, [admin, history])
    useEffect(() => {
        if (admin) {
            BarTableService.getBarTable(id).then((res) => setBarTable(res.data[0]))  
        }
    }, [admin, history,id])
    const handleSubmit = (evt) => {
        evt.preventDefault();
            if(barTable.name === undefined || barTable.name === "" || barTable.seats === undefined ){
                setOpenSubmitIncorrect(true)
            }else{
                const object = {
                    "name": barTable.name, "seats":parseInt(barTable.seats)
                }
                BarTableService.updateBarTable(id, object).then(response => {
                    if(response.status ===201){
                        history.push({ pathname: '/mesas/' + idBar, barTable:{ data: true }});
                    }else{
                        setOpenSubmitIncorrect(true)
                    }
                }).catch(error => {
                    console.log("Error" + error)
                })    
            }
    }

    const handleChange = (event) => {
        setBarTable({...barTable, [event.target.name]: event.target.value })
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
                Editar Mesa
            </Typography>
            <div style={{marginTop: '60px'}}>
                <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                    <Grid container justify="center" alignItems="center" >
                    <div>
                    <FormControl focused>
                        <InputLabel htmlFor="name">Nombre</InputLabel>
                        <Input className='input-title' id="name" label="Nombre" name="name"  value={barTable.name} onChange={(e) => handleChange(e)}/>
                    </FormControl>
                    </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                    <div style={{marginTop: '20px'}}>
                    <FormControl focused>
                        <InputLabel htmlFor="seats">Sillas</InputLabel>
                        <Input className='input-title' type="number" inputprops={{inputProps: { max: 10, min: 0 }}} id="seats" label="Sillas" name="seats" onChange={(e) => handleChange(e)} value={barTable.seats}/>
                    </FormControl>
                    </div>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ ...stylesComponent.buttonCrear }}>
                        Enviar
                    </Button> 
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ ...stylesComponent.buttonCrear }}
                        onClick={() => history.goBack()}>
                        Volver
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