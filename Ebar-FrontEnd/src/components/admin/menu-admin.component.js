import React, { useEffect, useState } from 'react';
//import events from '../img/even.jpg'
//import { List, ListItem, ListItemText, Collapse, Button } from '@material-ui/core';
//import { ExpandLess, ExpandMore } from '@material-ui/icons';
//import styles from '../styles/votations.css'
import MenuDataService from "../../services/menu.service";

function Menu() {

    const [menu, setMenu] = useState([])
    const [expanded, setExpanded] = useState({});

    const json = [
        {
            "id": 1,
            "items": [
                {
                    "id": 1,
                    "nombre": "Tortilla",
                    "precio": 4.5
                },
                {
                    "id": 2,
                    "nombre": "Chocos",
                    "precio": 5.5
                }
            ],

        }
            
        
    ]

    //esto hay que cambiarlo pero nose como iba pq nose si lo necesitamos
    const vot = [{ id: 1, titulo: 'Siguiente canción', descripcion: 'Vote para seleccionar la siguiente canción reproducida por nuestro DJ', opciones: [{ 1: 'Despacito' }, { 2: 'Baby Shark' }, { 3: 'Dale Don Dale' }] },
    { id: 2, titulo: 'Última canción de la noche', descripcion: 'Temón', opciones: [{ 1: 'Despacito' }, { 2: 'Baby Shark' }, { 3: 'Dale Don Dale' }] }]

    const handleClick = (id) => {
        setExpanded({
            ...expanded,
            [id]: !expanded[id]
        });
    }

    useEffect(() => {
        MenuDataService.getMenu().then(res => {
            console.log('Json', res)
            setMenu(res)
        }).catch(err => {
            console.log('Error', err)
        })
    }, [])

    /*Paco nos dijo algo de usar esto
    useEffect(() => {
        axios.get(API_URL)
            .then(res => {
                json = res.data
            })
    const [json, setJson] = useState('')
    */

    return(
        
        <table class="default">

        <caption>CARTA ADMINISTRADOR</caption>
      
        <thead>
      
          <tr>
      
            <th>Nombre</th>
      
            <th>Precio</th>

            <th>Añadir</th>
      
          </tr>
      
        </thead>
      
        
      
      </table>
    );
    }

export default Menu;
