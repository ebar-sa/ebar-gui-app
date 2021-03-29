import React, { useEffect, useState } from 'react';
//import events from '../img/even.jpg'
import { Button, TableRow, Table, TableBody, TableHead, TableCell
 } from '@material-ui/core';
//import { ExpandLess, ExpandMore } from '@material-ui/icons';

//import styles from '../styles/votations.css'
import MenuDataService from "../../services/menu.service";
import Bill from "./bill-admin.component";

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

   


    return(
        <div>

    <div  style={{ height: 400, width: '100%' }}>
        <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menu.items && menu.items.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.price}</TableCell>
              <TableCell align="left">
              <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAñadir }} >
                                        Añadir
                                    </Button>
                                    </TableCell>
            </TableRow>
          ))}
        </TableBody> 
        </Table>    
    </div>
      
      
    
      <div  style={{ height: 400, width: '100%' }}>

        PRODUCTOS PEDIDOS PERO NO ENTREGADOS
         <Table size="small" aria-label="a dense table">
   <TableHead>
           <TableRow>
            <TableCell>Nombre</TableCell>
             <TableCell>Precio</TableCell>
             <TableCell>Cantidad</TableCell>
             <TableCell>Total</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {Bill.itemBill && Bill.itemBill.map((row) => (
           <TableRow key={row.amount}>
             <TableCell component="th" scope="row">
                 {row.amount}
               </TableCell>
             <TableCell align="left">{row.itemMenu.name}</TableCell>

            </TableRow>
         ))}
       </TableBody> 
         </Table>    

         </div>

        <div>
            PRODUCTOS PEDIDOS Y ENTREGADOS
         <Table size="small" aria-label="a dense table">
         <TableHead>
           <TableRow>
             <TableCell>Nombre</TableCell>
             <TableCell>Precio</TableCell>
             <TableCell>Cantidad</TableCell>
             <TableCell>Total</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {Bill.itemBill && Bill.itemOrder.map((row) => (
             <TableRow key={row.amount}>
               <TableCell component="th" scope="row">
                 {row.amount}
               </TableCell>
               <TableCell align="left">{row.itemMenu.name}</TableCell>
               </TableRow>
               ))}
               </TableBody>
               </Table>
        </div>




     </div>
        );
    }

    const stylesComponent = {

        buttonAñadir: {
            backgroundColor: '#007bff',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontSize: '15px',
            fontWeight: '600'
        }
    }



/*
    AQUI ESTA MEDIO HECHO, PARA IR COGIENDO LAS COSAS E IR PROBANDO
    ////////-CUENTA-------/////
    <div  style={{ height: 400, width: '100%' }}>

    //TABLA DE PRODUCTOS PEDIDOS PERO NO ENTREGADOS
    <Table size="small" aria-label="a dense table">
<TableHead>
      <TableRow>
 <TableCell>Nombre</TableCell>
        <TableCell>Precio</TableCell>
        <TableCell>Cantidad</TableCell>
        <TableCell>Total</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Bill.itemBill.map((row) => (
      <TableRow key={row.amount}>
        <TableCell component="th" scope="row">
            {row.amount}
          </TableCell>
        <TableCell align="left">{row.itemMenu.name}</TableCell>

       </TableRow>
    ))}
  </TableBody> 
    </Table>    

        //TABLA DE PRODUCTOS PEDIDOS Y ENTREGADOS
    <Table size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell>Nombre</TableCell>
        <TableCell>Precio</TableCell>
        <TableCell>Cantidad</TableCell>
        <TableCell>Total</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Bill.itemOrder.map((row) => (
        <TableRow key={row.amount}>
          <TableCell component="th" scope="row">
            {row.amount}
          </TableCell>
          <TableCell align="left">{row.itemMenu.name}</TableCell>

        </TableRow>
      ))}
    </TableBody> 
   </Table>    
</div>




*/

export default Menu;


