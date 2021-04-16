import React, {} from "react";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    responsive: {
        maxWidth: "100%",
        maxHeight: "400px",
        height: "auto",
        width: "auto"

    }
}))

export default function CarouselSlide(props) {
    const classes = useStyles()

    return (
        <Grid container spacing={1} alignItems="center" justify="center">
            <Grid item xs={12} align="center">
                <Card>
                    <img alt="" src={"data:" + props.content.fileType + ";base64," + props.content.data} className={classes.responsive}/>
                </Card>
            </Grid>
            {props.isOwner &&
            <Grid item xs={12} align="center">
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon/>}
                    onClick={props.clickFunction}>
                    Eliminar
                </Button>
            </Grid>
            }
        </Grid>

    )
}