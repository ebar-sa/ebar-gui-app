import React, { useEffect, useState } from 'react';
//import events from '../img/even.jpg'
import { List, ListItem, ListItemText, Collapse, Button, TableRow, Table, TableBody, TableHead, TableCell
 } from '@material-ui/core';
 import { DataGrid } from '@material-ui/data-grid';
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
                    "id": 6,
                    "name": "Tataki de atun",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 9.0,
                    "category": {
                        "id": 3,
                        "name": "sugerencias"
                    },
                    "image": {
                        "id": 1,
                        "fileName": "name",
                        "fileType": "type",
                        "data": null
                    }
                },
                {
                    "id": 1,
                    "name": "Ensaladilla",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 2.5,
                    "category": {
                        "id": 1,
                        "name": "picoteamos"
                    },
                    "image": {
                        "id": 1,
                        "fileName": "name",
                        "fileType": "type",
                        "data": null
                    }
                },
                {
                    "id": 5,
                    "name": "Tortilla de patatas",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 3.5,
                    "category": {
                        "id": 2,
                        "name": "tapas"
                    },
                    "image": {
                        "id": 1,
                        "fileName": "name",
                        "fileType": "type",
                        "data": null
                    }
                },
                {
                    "id": 7,
                    "name": "Carrillera iberica",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 9.0,
                    "category": {
                        "id": 3,
                        "name": "sugerencias"
                    },
                    "image": {
                        "id": 1,
                        "fileName": "name",
                        "fileType": "type",
                        "data": null
                    }
                },
                {
                    "id": 2,
                    "name": "Patatas",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 2.5,
                    "category": {
                        "id": 1,
                        "name": "picoteamos"
                    },
                    "image": {
                        "id": 1,
                        "fileName": "name",
                        "fileType": "type",
                        "data": null
                    }
                },
                {
                    "id": 3,
                    "name": "Salmorejo",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 2.75,
                    "category": {
                        "id": 1,
                        "name": "picoteamos"
                    },
                    "image": {
                        "id": 1,
                        "fileName": "name",
                        "fileType": "type",
                        "data": null
                    }
                },
                {
                    "id": 4,
                    "name": "Flamenquin de queso",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 3.5,
                    "category": {
                        "id": 2,
                        "name": "tapas"
                    },
                    "image": {
                        "id": 1,
                        "fileName": "name",
                        "fileType": "type",
                        "data": null
                    }
                }
            ],
            "categories": [
                {
                    "id": 2,
                    "name": "tapas"
                },
                {
                    "id": 3,
                    "name": "sugerencias"
                },
                {
                    "id": 1,
                    "name": "picoteamos"
                }
            ]
        }
    ]

    //esto hay que cambiarlo pero nose como iba pq nose si lo necesitamos
    //const vot = [{ id: 1, titulo: 'Siguiente canción', descripcion: 'Vote para seleccionar la siguiente canción reproducida por nuestro DJ', opciones: [{ 1: 'Despacito' }, { 2: 'Baby Shark' }, { 3: 'Dale Don Dale' }] },
   // { id: 2, titulo: 'Última canción de la noche', descripcion: 'Temón', opciones: [{ 1: 'Despacito' }, { 2: 'Baby Shark' }, { 3: 'Dale Don Dale' }] }]

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

    const GetRows=()=>{

        const tableRows = menu.items.map(row => {
           const {id,name} ={row}
              return (
                <TableRow>
                <TableCell>{{id}}</TableCell>
                <TableCell>{name}</TableCell>
        
                </TableRow>
            );
          });
          return tableRows;
        }

    const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'name', headerName: 'name', width: 130 }]
    const rows = [ menu.items.map(x=>{
            
               // { id: x.id, name: x.name}
            })]


            const rows2 = [
                { id: 1, name:'Test'},
                { id: 2, name:'Test2'}]

    return(
    <div  style={{ height: 400, width: '100%' }}>
        <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menu.items.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.price}</TableCell>

            </TableRow>
          ))}
        </TableBody> 
        </Table>    
    </div>
      

        );
    }

export default Menu;


// items.map(x=>{
//     return(
//         <div>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Id</TableCell>
//                         <TableCell>Name</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {GetRows()}
//                 </TableBody>
//             </Table>
//         </div>
//     )
// })}