import React, {useState, useEffect} from "react";
import BarDataService from "../../services/bar.service";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {Paper} from "@material-ui/core";

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

    useEffect(() => {
        BarDataService.getAllWithCapacity().then(res => {
            setBars(res.data);
        })
            .catch(e => {
                console.log("El error es ", e);
            });
    }, [])
    return (

        <Container component="div" maxWidth="sm" className={classes.container}>
            <Typography component={"h4"} variant={"h4"} align={"center"}>Lista de bares</Typography>
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
