import React, { useEffect, useState } from 'react'
import MenuDataService from "../../services/menu.service"
import { makeStyles } from '@material-ui/core/styles'
import '../../styles/create-voting.css'
import { TextField, Button, Container, Grid, Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import { useHistory } from 'react-router'

const useStyles = makeStyles(() => ({
    root: {
        padding: "10px"
    },
    inputFile: {
        display: "none"
    },
    title: {
        paddingTop: "15px"
    },
    form: {
        paddingTop: "15px"
    }
}))
export default function CreateItemMenu(props) {
    const [state, setState] = useState('');
    const params = useParams();
    const classes = useStyles();
    const idBar = params.idBar;
    const [selectedFile, setSelectedFile] = useState()
    const [errors, setErrors] = useState({})
    const { auth } = useUser()
    const history = useHistory()
    const admin = auth.roles.includes('ROLE_OWNER') || auth.roles.includes('ROLE_EMPLOYEE');

    useEffect(() => {
        if (!admin) history.push('/pageNotFound/')
    }, [admin, history])

    const handleSubmit = (evt) => {
        evt.preventDefault();

        if (handleValidation()) {
            const itemMenu = {
                "name": state.name,
                "description": state.description,
                "category": state.category,
                "rationType": state.rationType,
                "price": state.price,
                "image": selectedFile
            }
            MenuDataService.createItem(idBar, itemMenu).then(response => {
                if (response.status === 201) {
                    props.history.push({ pathname: `/bares/${idBar}/menu`, state: { data: true } })
                }
            }).catch(error => {
                console.log("Error" + error)
            })
        }
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    function handleValidation() {
        let objErrors = {}
        let valid = true
        const decimal = new RegExp('^[0-9]+(.[0-9]{1,2})?$')

        if (!state.name) {
            valid = false
            objErrors['name'] = "El nombre del item tiene que rellenarse"
        }

        if (!state.category) {
            valid = false
            objErrors['category'] = "La categoría del item tiene que rellenarse"
        }

        if (!state.rationType) {
            valid = false
            objErrors['rationType'] = "La cantidad (ud, media ración, ración...) del item tiene que rellenarse"
        }

        if (!state.price.match(decimal)) {
            valid = false
            objErrors['price'] = "El precio puede contener hasta 2 decimales"
        }

        if (state.price < 0) {
            valid = false
            objErrors['price'] = "El precio debe de ser mayor a 0.00 €"
        }

        setErrors(objErrors)
        return valid
    }

    const selectFile = (e) => {
        let f = e.target.files.item(0)
        const fr = new FileReader()
        fr.onload = () => {
            let blob = btoa(fr.result)
            console.log(blob)
            let object = {
                "fileName": f.name,
                "fileType": f.type,
                "data": blob
            }
            setSelectedFile(object)
        }
        fr.readAsBinaryString(f)
    }

    return (
        <Container fixed>
            <div style={{ marginTop: '30px', marginBottom: '100px' }}>
                <Typography className='h5' variant="h5" gutterBottom>
                    Creación del Item
            </Typography>
                <div style={{ marginTop: '30px' }}>
                    <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                        <Grid container justify="center" alignItems="center">
                            <div>
                                <TextField fullWidth required
                                    id="name"
                                    label="Nombre"
                                    name="name"
                                    helperText={errors.name}
                                    onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{ "paddingBottom": "10px" }} >
                                <TextField fullWidth
                                    id="description"
                                    label="Descripción"
                                    name="description"
                                    onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{ "paddingBottom": "10px" }} >
                                <TextField fullWidth required
                                    id="category"
                                    label="Categoria"
                                    name="category"
                                    helperText={errors.category}
                                    onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{ "paddingBottom": "10px" }} >
                                <TextField fullWidth required
                                    id="rationType"
                                    label="Cantidad"
                                    name="rationType"
                                    helperText={errors.rationType}
                                    onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>

                        <Grid container justify="center" alignItems="center" >
                            <div style={{ "paddingBottom": "10px" }} >
                                <TextField fullWidth type="text" required
                                    id="price"
                                    label="Precio"
                                    name="price"
                                    helperText={errors.price}
                                    onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center">
                            <div style={{ "paddingBottom": "10px" }} >
                                <input
                                    accept="image/*"
                                    id="contained-button-file"
                                    type="file"
                                    className={classes.inputFile}
                                    data-testid={"prueba"}
                                    onChange={selectFile}
                                />
                                <Typography className={classes.inputFile} variant="subtitle1" gutterBottom>
                                    Subida de imágenes
                                </Typography>
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" component="span">
                                        Subir imágenes
                                    </Button>
                                </label>
                            </div>
                        </Grid>
                        <Grid>
                            <div style={{ "textAlign": "center", "paddingBottom": "10px" }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary">
                                    Enviar
                        </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => history.goBack()}>
                                    Volver
                        </Button>
                            </div>
                        </Grid>
                    </form>
                </div>
            </div>
        </Container>

    )















}
