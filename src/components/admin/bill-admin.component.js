import React, { useEffect, useState } from 'react';
//import events from '../img/even.jpg'

//import { ExpandLess, ExpandMore } from '@material-ui/icons';

//import styles from '../styles/votations.css'
import BillDataService from "../../services/bill.service";


function Bill() {

    const [bill, setBill] = useState([])
    const [expanded, setExpanded] = useState({});

    const json = [
        {
            "id": 1,
            "table": {
                "id": 1,
                "name": "Mesa 1",
                "token": "SF45GT",
                "free": false,
            },
            "itemBill": [
                {
                    "id": 3,
                    "amount": 1,
                    "itemMenu": {
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
                    }
                },
                {
                    "id": 2,
                    "amount": 4,
                    "itemMenu": {
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
                    }
                },
                {
                    "id": 1,
                    "amount": 2,
                    "itemMenu": {
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
                    }
                }
            ],
            "itemOrder": null
        }
    ]

    useEffect(() => {
        BillDataService.getBill().then(res => {
            console.log('Json', res)
            setBill(res)
        }).catch(err => {
            console.log('Error', err)
        })
    }, [])

    

    // <div  style={{ height: 400, width: '100%' }}>

    //     //TABLA DE PRODUCTOS PEDIDOS PERO NO ENTREGADOS
    //     <Table size="small" aria-label="a dense table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Nombre</TableCell>
    //         <TableCell>Precio</TableCell>
    //         <TableCell>Cantidad</TableCell>
    //         <TableCell>Total</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {menu.items.map((row) => (
    //         <TableRow key={row.name}>
    //           <TableCell component="th" scope="row">
    //             {row.name}
    //           </TableCell>
    //           <TableCell align="left">{row.price}</TableCell>

    //         </TableRow>
    //       ))}
    //     </TableBody> 
    //     </Table>    

    //         //TABLA DE PRODUCTOS PEDIDOS Y ENTREGADOS
    //     <Table size="small" aria-label="a dense table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Nombre</TableCell>
    //         <TableCell>Precio</TableCell>
    //         <TableCell>Cantidad</TableCell>
    //         <TableCell>Total</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {menu.items.map((row) => (
    //         <TableRow key={row.name}>
    //           <TableCell component="th" scope="row">
    //             {row.name}
    //           </TableCell>
    //           <TableCell align="left">{row.price}</TableCell>

    //         </TableRow>
    //       ))}
    //     </TableBody> 
    //     </Table>    
    // </div>
      

       
    }

export default Bill;


