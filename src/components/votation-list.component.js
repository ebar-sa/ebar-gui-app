import React, { useEffect, useState } from 'react';
import events from '../img/even.jpg'
import { List, ListItem, ListItemText, Collapse, Button } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styles from '../styles/votations.css'
import VotationDataService from "../services/votations.service";

function Votations() {

    const [votations, setVotations] = useState([])
    const [expanded, setExpanded] = useState({});

    const json = [
        {
            "id": 1,
            "titulo": "Color fav",
            "descripcion": "Color",
            "inicio": "2020-02-02T01:00:00",
            "fin": "2020-10-10T02:00:00",
            "bar": {
                "id": 1,
                "nombre": "Sabor Cubano",
                "descripcion": "Bar Cubanito",
                "contacto": "Jony",
                "ubicacion": "Extremadura",
                "imagenes": [],
                "itemsCarta": [],
                "empresa": {
                    "id": 1,
                    "nombre": "pacorosa",
                    "apellidos": "Rosa",
                    "telefono": "612345667",
                    "email": "paco@gmail.com",
                    "contrasenya": "paco1234",
                    "dni": "1234567K",
                    "cif": "1234445L"
                }
            },
            "opciones": [
                {
                    "id": 1,
                    "nombre": "Rojo"
                },
                {
                    "id": 2,
                    "nombre": "Azul"
                }
            ]
        }
    ]

    const vot = [{ id: 1, titulo: 'Siguiente canción', descripcion: 'Vote para seleccionar la siguiente canción reproducida por nuestro DJ', opciones: [{ 1: 'Despacito' }, { 2: 'Baby Shark' }, { 3: 'Dale Don Dale' }] },
    { id: 2, titulo: 'Última canción de la noche', descripcion: 'Temón', opciones: [{ 1: 'Despacito' }, { 2: 'Baby Shark' }, { 3: 'Dale Don Dale' }] }]

    const handleClick = (id) => {
        setExpanded({
            ...expanded,
            [id]: !expanded[id]
        });
    }

    useEffect(() => {
        VotationDataService.getVotations().then(res => {
            console.log('Json', res)
            setVotations(res)
        }).catch(err => {
            console.log('Error', err)
        })
    }, [])

    return (

        <div>
            <div className='container'>
                <img className='img' alt="events" src={events} />
                <div className="div-vot">Votaciones</div>
            </div>
            <div>
                <h5 style={styles.h5}>
                    A continuación, podrá encontrar la lista de votaciones disponibles en las que puede participar
                </h5>
            </div>
            <div className='div-list'>
                <List component="nav">
                    {vot.map(x =>
                        <div key={x.id}>
                            <ListItem button onClick={() => handleClick(x.id)} style={{ ...stylesComponent.listitem }}>
                                <ListItemText disableTypography style={{ ...stylesComponent.listItemText1 }} primary={x.titulo} />
                                <Button variant="contained" size='small' target="_blank" href="http://www.google.es" color="primary"
                                    style={{ ...stylesComponent.button }} >
                                    Acceder
                            </Button>
                                {!expanded[x.id] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={expanded[x.id]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding style={{ ...stylesComponent.listdetail }}>
                                    <ListItem>
                                        <ListItemText disableTypography style={{ ...stylesComponent.listItemText2 }}>
                                            <p>{x.descripcion}</p>
                                            <p className='p'>Fecha fin: 22/05/2021 23:45</p>
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </div>
                    )}
                </List>
            </div>
        </div>
    )
}

const stylesComponent = {
    button: {
        backgroundColor: '#007bff',
        marginRight: '60px',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600'
    },
    listdetail: {
        backgroundColor: 'rgba(215, 211, 211, 0.3)',
        borderRadius: '5px',
        marginTop: '3px'
    },
    listitem: {
        backgroundColor: 'rgba(215, 211, 211, 0.74)',
        borderRadius: '5px',
        height: '55px',
        marginTop: '3px'
    },
    listItemText1: {
        fontSize: '18px'
    },
    listItemText2: {
        marginTop: '10px'
    }
}

export default Votations