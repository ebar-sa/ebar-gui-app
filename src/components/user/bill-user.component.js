import React, { useEffect, useState } from 'react';
//import events from '../img/even.jpg'
import { List, ListItem, ListItemText, Collapse, Button, TableRow, Table, TableBody, TableHead, TableCell
 } from '@material-ui/core';
//import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'
//import styles from '../styles/votations.css'
import BillDataService from "../../services/bill.service";
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

export function Bill(props) {
  const classes = useStyles()
  const {id, itemBill, itemOrder} = props
  const history = useHistory()
  const routeRedirect = () => {
    console.log(id);
    let path = `/bar/bill/${id}`;
    history.push(path);

  }

  }
  export default Bill;