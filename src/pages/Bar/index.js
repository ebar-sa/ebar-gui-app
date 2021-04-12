import React, {useEffect, useState} from "react";
import BarDataService from "../../services/bar.service";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CloseIcon from '@material-ui/icons/Close';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import {green, red} from "@material-ui/core/colors";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    root: {
        alignSelf: "center",
        margin: "10px",
        flexGrow: 1
    },
    block: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: "auto",

    },
    bottomDivider: {
        borderBottom: "0.1em solid darkgray",
        lineHeight: "90%"
    },
    barHeader: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: "auto",
        marginBottom: '10px'
    },
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex'
    },
    buttons: {
        alignItems: "stretch"
    }
}))

const logo = require('../../img/no-image.png');

export default function Bar(props){

    const classes = useStyles();
    const [bar, setBar] = useState({});
    const barId = props.match.params.barId;

    useEffect( () => {
        BarDataService.getBar(barId).then(res => {
            setBar(res.data);
        })
    }, [props.match.params.barId])

    return (
        <div className={classes.root}>
            <Paper className={classes.barHeader}>
                <Typography component="h5" variant="h5" align="center">
                    {bar.name}
                </Typography>
            </Paper>

            <Grid container spacing={2} alignItems="center" justify="center">
                <Grid item xs={12} sm={6} align="center">
                    {(bar && bar.images && bar.images.length > 0) ? <img alt="" src={"data:" + bar.images[0].fileType + ";base64," + bar.images[0].data} /> :
                        <img alt="" src={logo.default}/>}
                </Grid>

                <Grid item xs={12} sm={6} align="center">
                    <Paper className={classes.block}>
                        <Grid container spacing={1} justify={"center"}>
                            <Grid item xs={12} className={classes.bottomDivider}>
                                <Grid container justify={"center"}>
                                    <Grid item>
                                        {(bar.freeTables > 0) ?
                                            <SvgIcon style={{ color: green[300] }} component={CheckBoxIcon} viewBox="0 0 24 18"/> :
                                            <SvgIcon style={{ color: red[300] }} component={CloseIcon} viewBox="0 0 24 18"/>}
                                    </Grid>
                                    <Grid item>
                                        <Typography component="h6" variant="h6" align="center">
                                            Mesas disponibles: {bar.freeTables}/{bar.tables}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.bottomDivider}>
                                <Typography variant={"subtitle1"} align="center">
                                    {bar.location}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant={"body1"} align="center">
                                    {bar.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item container xs={12} >
                    <ButtonGroup fullWidth={true} color="primary" aria-label="outlined primary button group" className={classes.buttons}>
                        <Button href={`/#/mesas`}>Mesas</Button>
                        <Button href={`/#/bares/${barId}/menu`}>Carta</Button>
                        <Button href={`/#/bares/${barId}/votings`}>Votaciones</Button>
                    </ButtonGroup>
                </Grid>

            </Grid>


        </div>
    );

    
    
}