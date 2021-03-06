import React, {useEffect, useState} from 'react';
import MenuDataService from '../../services/menu.service';
import {makeStyles} from '@material-ui/core/styles';
import '../../styles/create-voting.css';
import {
    TextField,
    Button,
    Container,
    Grid,
    Typography,
    CardContent,
    Card,
} from '@material-ui/core';
import {useParams} from 'react-router-dom';
import useUser from '../../hooks/useUser';
import {useHistory} from 'react-router';
import BarDataService from '../../services/bar.service';
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles(() => ({
    root: {
        padding: '10px',
    },
    inputFile: {
        display: 'none',
    },
    title: {
        paddingTop: '15px',
    },
    form: {
        paddingTop: '15px',
    },
}));
export default function CreateItemMenu(props) {
    const [state, setState] = useState('');
    const params = useParams();
    const classes = useStyles();
    const idBar = params.idBar;
    const [selectedFile, setSelectedFile] = useState();
    const [errors, setErrors] = useState({});
    const [openImageError, setOpenImageError] = useState(false)
    const {auth} = useUser();
    const history = useHistory();
    const admin =
        auth.roles.includes('ROLE_OWNER') || auth.roles.includes('ROLE_EMPLOYEE');
    const username = auth.username;

    useEffect(() => {
        if (!admin) history.push('/pageNotFound/');
    }, [admin, history]);

    useEffect(() => {
        BarDataService.getBar(idBar)
            .then((res) => {
                let owner = res.data.owner;
                let emp = res.data.employees.map((a) => a.username);
                console.log('Emp', emp);
                if (!(owner === username || emp.includes(username))) history.push('/');
            })
            .catch((err) => {
                history.push('/pageNotFound/');
            });
    }, [idBar, history, username]);

    const handleSubmit = (evt) => {
        evt.preventDefault();

        if (handleValidation()) {
            const itemMenu = {
                name: state.name,
                description: state.description,
                category: state.category,
                rationType: state.rationType,
                price: state.price,
                image: selectedFile,
            };
            MenuDataService.createItem(idBar, itemMenu)
                .then((response) => {
                    if (response.status === 201) {
                        props.history.push({
                            pathname: `/bares/${idBar}/menu`,
                            state: {data: true},
                        });
                    }
                })
                .catch((error) => {
                    console.log('Error' + error);
                });
        }
    };

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.value});
    };

    function handleValidation() {
        let objErrors = {};
        let valid = true;
        const decimal = new RegExp('^[0-9]+(\\.[0-9]{1,2})?$');

        if (!state.name) {
            valid = false;
            objErrors['name'] = 'El nombre del item tiene que rellenarse';
        }

        if (!state.category) {
            valid = false;
            objErrors['category'] = 'La categor??a del item tiene que rellenarse';
        }

        if (!state.rationType) {
            valid = false;
            objErrors['rationType'] =
                'La cantidad (ud, media raci??n, raci??n...) del item tiene que rellenarse';
        }

        if (!state.price.match(decimal)) {
            valid = false;
            objErrors['price'] =
                'El precio debe de estar en formato xx o xx.yy con dos decimales como m??ximo';
        }

        if (state.price <= 0) {
            valid = false;
            objErrors['price'] = 'El precio debe de ser mayor a 0.00 ???';
        }

        setErrors(objErrors);
        return valid;
    }

    const selectFile = (e) => {
        let f = e.target.files.item(0);
        if (f !== null && f.size < 3000000) {
            const fr = new FileReader();
            fr.onload = () => {
                let blob = btoa(fr.result);
                console.log(blob);
                let object = {
                    fileName: f.name,
                    fileType: f.type,
                    data: blob,
                };
                setSelectedFile(object);
            };
            fr.readAsBinaryString(f);
        } else if (f !== null) {
            setOpenImageError(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenImageError(false)
    };

    return (
        <Container fixed>
            <Typography align="center" variant="h4" style={{margin: '25px auto'}}>
                Creaci??n del Item
            </Typography>
            <Card style={{maxWidth: 500, margin: 'auto'}}>
                <CardContent>
                    <div style={{marginTop: '30px', marginBottom: '100px'}}>
                        <div style={{marginTop: '30px'}}>
                            <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                                <Grid container justify="center" alignItems="center" spacing={1}>
                                    <Grid item xs={12} align={"center"}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="name"
                                            label="Nombre"
                                            name="name"
                                            helperText={errors.name}
                                            onChange={(e) => handleChange(e)}
                                            style={{marginBottom: 10}}
                                        />
                                    </Grid>

                                    <Grid item xs={12} align={"center"}>
                                        <TextField
                                            fullWidth
                                            id="description"
                                            label="Descripci??n"
                                            name="description"
                                            onChange={(e) => handleChange(e)}
                                            style={{marginBottom: 10}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="category"
                                            label="Categoria"
                                            name="category"
                                            helperText={errors.category}
                                            onChange={(e) => handleChange(e)}
                                            style={{marginBottom: 10}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="rationType"
                                            label="Cantidad"
                                            name="rationType"
                                            helperText={errors.rationType}
                                            onChange={(e) => handleChange(e)}
                                            style={{marginBottom: 10}}
                                        />
                                    </Grid>

                                    <Grid item xs={12} align={"center"}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            required
                                            id="price"
                                            label="Precio"
                                            name="price"
                                            helperText={errors.price}
                                            onChange={(e) => handleChange(e)}
                                            style={{marginBottom: 10}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <input
                                            accept="image/*"
                                            id="contained-button-file"
                                            type="file"
                                            className={classes.inputFile}
                                            data-testid={'prueba'}
                                            onChange={selectFile}
                                        />
                                        <label
                                            htmlFor="contained-button-file"
                                            style={{margin: '20px 0'}}
                                        >
                                            <Button variant="contained" component="span">
                                                Subir im??genes
                                            </Button>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <Typography className='p' variant="body2" gutterBottom>
                                            Tama??o m??ximo de imagen: 3 MB
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align={"center"}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Enviar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => history.goBack()}
                                            style={{marginLeft: 5}}
                                        >
                                            Volver
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Snackbar open={openImageError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    La imagen se ha descartado porque superaba los 3 MB de tama??o
                </Alert>
            </Snackbar>
        </Container>
    );
}
