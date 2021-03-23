import React from 'react';
import { Typography } from "@material-ui/core";

import Copyright from './Copyright';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Footer() {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Ebar
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Porque nos gusta innovar
        </Typography>
        <Copyright />
      </footer>
    );
  }