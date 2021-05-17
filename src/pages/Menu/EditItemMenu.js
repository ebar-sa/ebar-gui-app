import React, { useEffect, useState } from 'react'
import MenuDataService from "../../services/menu.service"
import { makeStyles } from '@material-ui/core/styles'
import '../../styles/create-voting.css'
import { TextField, Button, Container, Grid, Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import useUser from "../../hooks/useUser"
import { useHistory } from 'react-router'
import BarDataService from "../../services/bar.service"
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

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
        name: '',
        description: '',
        category: '',
        rationType: '',
        price: ''
    });
    const params = useParams()
    const classes = useStyles()
    const [selectedFile, setSelectedFile] = useState()
    const { auth } = useUser()
    const idBar = params.idBar
    const idItemMenu = params.idItemMenu
    const history = useHistory()
    const [errors, setErrors] = useState({})
    const [openImageError, setOpenImageError] = useState(false)
    const admin = auth.roles.includes('ROLE_OWNER') || auth.roles.includes('ROLE_EMPLOYEE')
    const username = auth.username

    useEffect(() => {
        if (!admin) {
            history.push('/pageNotFound/')
        } else {
            MenuDataService.getItem(idBar, idItemMenu).then(
                res => {
                    if (res.status === 200) {
                        setItemMenu(res.data)
                    } else {
                        history.push('/pageNotFound/')
                    }
                }
            )
        }
    }, [admin, history, idBar, idItemMenu])

    useEffect(() => {
        BarDataService.getBar(idBar).then(res => {
            let owner = res.data.owner
            let emp = res.data.employees.map(a => a.username)
            if (!(owner === username || emp.includes(username))) history.push('/')
        }).catch(err => {
            history.push('/pageNotFound/')
        })
    }, [idBar, history, username])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (handleValidation()) {
            const item = {
                "name": itemMenu.name,
                "description": itemMenu.description,
                "category": itemMenu.category,
                "rationType": itemMenu.rationType,
                "price": itemMenu.price,
                "image": selectedFile
            }
            MenuDataService.editItem(idBar, idItemMenu, item).then(response => {
                if (response.status === 200) {
                    props.history.push({ pathname: `/bares/${idBar}/menu`, item: { data: true } })
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
        const decimal = new RegExp('^[0-9]+(\\.[0-9]{1,2})?$')
        let price = itemMenu.price

        if (!itemMenu.name) {
            valid = false
            objErrors['name'] = "El nombre del item tiene que rellenarse"
        }
        if (!itemMenu.category) {
            valid = false
            objErrors['category'] = "La categoría del item tiene que rellenarse"
        }
        if (!itemMenu.rationType) {
            valid = false
            objErrors['rationType'] = "La cantidad (ud, media ración, ración...) del item tiene que rellenarse"
        }
        if (!decimal.test(price)) {
            valid = false;
            objErrors['price'] = "El precio debe de estar en formato xx o xx.yy con dos decimales como máximo"
        }
        if (price <= 0) {
            valid = false;
            objErrors['price'] = "El precio debe de ser mayor a 0.00 €"
        }
        setErrors(objErrors)
        return valid
    }

    const selectFile = (e) => {
        let f = e.target.files.item(0)
        if (f !== null && f.size < 3000000) {
            const fr = new FileReader()
            fr.onload = () => {
                let blob = btoa(fr.result)
                let object = {
                    "fileName": f.name,
                    "fileType": f.type,
                    "data": blob
                }
                setSelectedFile(object)
            }
            fr.readAsBinaryString(f)
        } else if (f !== null) {
            setOpenImageError(true)
        }

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenImageError(false)
    };

    const stylesComponent = {
        buttonAdd: {
            backgroundColor: '#006e85',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center'
        }
    }

    return (
        <Container maxWidth={"md"}>
            <Grid container spacing={2} justify="center" alignItems="center" alignContent={"center"} >
                <Grid item xs={12} style={{ marginTop: '30px'}} align={"center"}>
                    <Typography className='h5' variant="h5" gutterBottom>
                        Editar el Item
                    </Typography>
                </Grid>
                <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                    <Grid item xs={12} style={{ "paddingBottom": "10px" }} align={"center"}>
                        <TextField fullWidth id="name"
                            label="Nombre"
                            name="name"
                            helperText={errors.name}
                            onChange={(e) => handleChange(e)}
                            value={itemMenu.name} />
                    </Grid>
                    <Grid item xs={12} style={{ "paddingBottom": "10px" }} align={"center"}>
                        <TextField fullWidth id="description" multiline
                            label="Descripción"
                            name="description"
                            onChange={(e) => handleChange(e)}
                            value={itemMenu.description} />
                    </Grid>
                    <Grid item xs={12} style={{ "paddingBottom": "10px" }} align={"center"}>
                        <TextField fullWidth id="category"
                            label="Categoria"
                            name="category"
                            helperText={errors.category}
                            onChange={(e) => handleChange(e)}
                            value={itemMenu.category} />
                    </Grid>
                    <Grid item xs={12} style={{ "paddingBottom": "10px" }} align={"center"}>
                        <TextField fullWidth id="rationType"
                            label="Cantidad"
                            name="rationType"
                            helperText={errors.rationType}
                            onChange={(e) => handleChange(e)}
                            value={itemMenu.rationType} />
                    </Grid>
                    <Grid item xs={12} style={{ "paddingBottom": "10px" }} align={"center"}>
                        <TextField fullWidth type="text"
                            id="price"
                            label="Precio"
                            name="price"
                            helperText={errors.price}
                            onChange={(e) => handleChange(e)}
                            value={itemMenu.price} />
                    </Grid>
                    {(itemMenu.image == null &&
                    <div>
                        <Grid item xs={12} style={{ "paddingBottom": "10px" }} align={"center"}>
                            <input
                                accept="image/*"
                                id="contained-button-file"
                                type="file"
                                className={classes.inputFile}
                                data-testid={"prueba"}
                                onChange={selectFile}
                                value={itemMenu.image}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" component="span">
                                    Subir imágenes
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className='p' variant="body2" gutterBottom>
                                Tamaño máximo de imagen: 3 MB
                            </Typography>
                        </Grid>
                    </div>
                    )}
                    <Grid item xs={12} style={{ "textAlign": "center", "paddingBottom": "10px" }}>
                        <Grid container justify={"center"} alignContent={"space-between"} spacing={1}>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{ ...stylesComponent.buttonCrear }}>
                                    Enviar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ ...stylesComponent.buttonCrear }}
                                    onClick={() => history.goBack()}>
                                    Volver
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            <Snackbar open={openImageError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    La imagen se ha descartado porque superaba los 3 MB de tamaño
                </Alert>
            </Snackbar>
            </Grid>
        </Container>

    )

}