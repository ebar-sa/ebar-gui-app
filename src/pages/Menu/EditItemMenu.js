import React, {useEffect, useState} from 'react'
import MenuDataService from "../../services/menu.service"
import { makeStyles } from '@material-ui/core/styles'
import '../../styles/create-voting.css'
import {TextField, Button, Container, Grid, Typography} from '@material-ui/core'
import { useParams } from 'react-router-dom'
import useUser from "../../hooks/useUser"
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

export default function EditItemMenu(props) {
    const [itemMenu, setItemMenu] = useState({
        name : '',
        description : '',
        category : '',
        rationType : '',
        price : ''
    });
    const params = useParams()
    const classes = useStyles()
    const [selectedFile, setSelectedFile] = useState()
    const { auth } = useUser()
    const idBar = params.idBar
    const idItemMenu = params.idItemMenu
    const history = useHistory()
    const [errors, setErrors] = useState({})
    const admin = auth.roles.includes('ROLE_OWNER') || auth.roles.includes('ROLE_EMPLOYEE');    

    useEffect(() => {
        if (!admin){ 
            history.push('/pageNotFound/')
        } else{
            MenuDataService.getItem(idBar, idItemMenu).then(
                res => {
                    if(res.status === 200){
                        setItemMenu(res.data)
                    } else {
                        history.push('/pageNotFound/')
                    }
                }
            )
        }
    }, [admin, history, idBar, idItemMenu])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if(handleValidation()) {
            const item = {
                "name": itemMenu.name,
                "description" : itemMenu.description,
                "category" : itemMenu.category,
                "rationType": itemMenu.rationType,
                "price" : itemMenu.price,
                "image" : selectedFile
            }
            MenuDataService.editItem(idBar,idItemMenu, item).then(response => {
                if(response.status === 200) {
                    props.history.push({pathname: `/bares/${idBar}/menu`, item: {data: true }})
                }
            }).catch(error => {
                console.log("Error" + error)
                history.push('/pageNotFound')
            })
        }
            
    }

    const handleChange = (event) => {
        setItemMenu({ ...itemMenu, [event.target.name]: event.target.value });
    }

    function handleValidation() {
        let objErrors = {}
        let valid = true
        const decimal = new RegExp('^[0-9]+(.[0-9]{1,2})?$')
        let price = itemMenu.price

        if(!itemMenu.name) {
            valid = false
            objErrors['name'] = "El nombre del item tiene que rellenarse"
        }
        if(!itemMenu.category) {
            valid = false
            objErrors['category'] = "La categoría del item tiene que rellenarse"
        }
        if(!itemMenu.rationType) {
            valid = false
            objErrors['rationType'] = "La cantidad (ud, media ración, ración...) del item tiene que rellenarse"
        }
        if(!decimal.test(price)){
            valid = false;
            objErrors['price'] = "El precio debe de incluir decimales"
        }
        if(price < 0 ) {
            valid = false;
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
    
    const stylesComponent = {
        buttonAñadir: {
            backgroundColor: '#007bff',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center'
        }
    }

    return (
        <Container fixed>
            <div style={{ marginTop: '30px', marginBottom: '100px'}}>
            <Typography className='h5' variant="h5" gutterBottom>
                Editar el Item
            </Typography>
            <div style={{marginTop: '30px'}}>
                <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>

                    <Grid container justify="center" alignItems="center" >
                    <div>
                        <TextField id="name" 
                        label="Nombre" 
                        name="name" 
                        helperText={errors.name}
                        onChange={(e) => handleChange(e)} 
                        value={itemMenu.name}/>
                    </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{"paddingBottom": "10px"}} >
                            <TextField id="description" 
                                label="Descripción" 
                                name="description" 
                                onChange={(e) => handleChange(e)} 
                                value={itemMenu.description}/>
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{"paddingBottom": "10px"}} >
                            <TextField id="category" 
                                label="Categoria" 
                                name="category" 
                                helperText={errors.category}
                                onChange={(e) => handleChange(e)} 
                                value={itemMenu.category}/>
                    </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{"paddingBottom": "10px"}} >
                            <TextField id="rationType" 
                                label="Cantidad" 
                                name="rationType" 
                                helperText={errors.rationType}
                                onChange={(e) => handleChange(e)} 
                                value={itemMenu.rationType}/>
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{"paddingBottom": "10px"}} >
                            <TextField type="text" 
                                id="price" 
                                label="Precio" 
                                name="price" 
                                helperText={errors.price}
                                onChange={(e) => handleChange(e)} 
                                value={itemMenu.price}/>
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center">
                        <div style={{"paddingBottom": "10px"}} >
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
                        <div style={{"textAlign":"center","paddingBottom": "10px"}}>
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
                        </div>
                    </Grid>
                </form>
            </div>
        </div>
        </Container>

    )

}