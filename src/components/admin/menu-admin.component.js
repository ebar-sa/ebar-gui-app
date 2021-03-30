import React, { useEffect, useState } from 'react';
//import events from '../img/even.jpg'
import { List, ListItem, ListItemText, Collapse, Button, TableRow, Table, TableBody, TableHead, TableCell
 } from '@material-ui/core';
 import { DataGrid } from '@material-ui/data-grid';
//import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'
//import styles from '../styles/votations.css'
import MenuDataService from "../../services/menu.service";
import Bill from "./bill-admin.component";
import { useHistory } from "react-router"

const useStyles = makeStyles({
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  occupied: {
    backgroundColor: '#ddd',
  },
  free: {
    backgroundColor: '#fff',
  },
  cardAction: {
    width: '100%',
  },
})

export function Menu(props) {
  const classes = useStyles()
  const {id, items} = props
  const history = useHistory()
  const routeRedirect = () => {
    console.log(id);
    let path = `/mesas/detallesMesa/${id}`;
    history.push(path);

  }

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
          {items && items.map((row) => (
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
    </div>
    )
    const stylesComponent = {

        buttonAñadir: {
            backgroundColor: '#007bff',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontSize: '15px',
            fontWeight: '600'
        }
    }







  }
  export default Menu;