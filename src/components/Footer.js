import React from 'react';
import {Typography} from "@material-ui/core";

import Copyright from './Copyright';

import {makeStyles} from '@material-ui/core/styles';
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
        textAlign: 'center'
    },
}));

export default function Footer() {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
            <Typography variant="h6" gutterBottom>
                Ebar
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
                Porque nos gusta innovar
            </Typography>
            <Link href="#/terms" variant="body1">
                Términos y condiciones de uso.
            </Link>
            <Copyright/>
        </footer>
    );
}