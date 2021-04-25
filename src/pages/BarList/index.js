import React, {useState, useEffect} from "react";
import BarDataService from "../../services/bar.service";
import { useHistory } from 'react-router';
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import useUser from "../../hooks/useUser";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: "10px",
        marginBottom: "100px"
    },
    list: {
        textAlign: 'left',
        margin: 'auto',
        backgroundColor: theme.palette.background.paper
    }
}))

export default function BarList() {

    const classes = useStyles()
    const [bars, setBars] = useState([])
    const history = useHistory()
    const { auth } = useUser()

    useEffect(() => {
        BarDataService.getAllWithCapacity().then(res => {
            res.data.sort(function (a, b) {
                const splitA = a.capacity.split('/')
                const splitB = b.capacity.split('/')
                const freeA = parseFloat(splitA[0])
                const freeB = parseFloat(splitB[0])
                return freeB - freeA
            });   
            setBars(res.data);
        })
            .catch(e => {
                console.log("El error es ", e);
            });
    }, [])
    return (

        <Container component="div" maxWidth="sm" className={classes.container}>
            <Grid container spacing={1} alignContent="space-between" alignItems="center" justify={"center"}>
                <Grid item>
                    <Typography component={"h4"} variant={"h4"} align={"center"}>Lista de bares</Typography>
                </Grid>

                {auth.roles.includes('ROLE_OWNER') &&
                <Grid item>
                    <Button
                        startIcon={<AddIcon/>}
                        type="button"
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            history.push("/bares/create")
                        }}>
                        Añadir nuevo bar
                    </Button>
                </Grid>
                }
            </Grid>
            <Paper className={classes.container}>
                <List component={"nav"} className={classes.list}>
                    {bars  && bars.map((bar, idx) => (
                        <div key={bar.id}>

                            <ListItem button component={Link} to={"/bares/" + bar.id}>
                                <ListItemText
                                    primary={bar.name}
                                    secondary={"Mesas disponibles: " + bar.capacity}/>
                            </ListItem>
                            {bars.length > (idx+1) ? <Divider /> : ""}
                        </div>
                        ))}
                </List>
            </Paper>
        </Container>
    );
}
