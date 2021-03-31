import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router"
import AuthService from "../services/auth.service";
import VotingDataService from "../services/votings.service";
import { Icon, Typography, FormControl, RadioGroup, Button, FormControlLabel, Radio, Card, CardContent, Divider, Snackbar } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';

function VotingDetailUser(props) {
    
  const [radioValue, setRadioValue] = useState("0")
  const [voteSuccess, setVoteSuccess] = useState(false)
  const [formError, setFormError] = useState(false)
  const [voting, setVoting] = useState({})
  const [canVote, setCanVote] = useState(false)
  const currentUser = AuthService.getCurrentUser()
  const history = useHistory()

    function Alert(propss) {
      return <MuiAlert elevation={6} variant="filled" {...propss} />;
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setFormError(false);
      setVoteSuccess(false);
    };

    const handleSubmit = (event) => {
      if (radioValue === "0") {
        setFormError(true)
      } else {
        VotingDataService.vote(voting.id, radioValue, currentUser.accessToken)
          .then(() => {
            setCanVote(false)
            setVoteSuccess(true)
            history.push("/votings")
          })
          .catch((error) => {
            //Show message when post return error
            console.log("Error de la peticion: "+error)
          })
      }
    }

    const handleRadioChange = (event) => {
      event.persist()
      setRadioValue(event.target.value)
    }

    const toDateFromString = (dateString) => {
       let aux = dateString.split(/(\d{2,})/)
       
       return new Date(parseInt(aux[5]), parseInt(aux[3])-1, aux[1], aux[7], aux[9], aux[11])
    }

    const createOptions = (options) => {
      let res = [];

      if(!options || options.length === 0) {
        res.push(<Icon>info</Icon>,<Typography> Sin opciones disponibles</Typography>)
      }else{
        for (let i = 0; i < options.length; i++) {
          res.push(<FormControlLabel key={options[i].id.toString()} value={options[i].id.toString()} control={<Radio />} label={options[i].description}/>)
        }
      }

      return res;
    }

    const votingHasExpired = () => {
      let res = false

      if (voting.closingHourc && toDateFromString(voting.closingHour) < Date.now()) {
          res = true
      }
    
      return res
    }

    useEffect(() => {
      const votingId = props.match.params.votingId

      //This is sample code. Replace with real data
      VotingDataService.getVoting(votingId, currentUser.accessToken).then(res => {
        setVoting(res)

        let dateNow = Date.now()
        let schDate = false
        let sohDate = false

        sohDate = toDateFromString(res.openingHour)
        
        if (res.closingHour != null) {
          schDate = toDateFromString(res.closingHour)
        }

        if (!res.votersUsernames.includes(currentUser.username)
        && sohDate < dateNow
        && (schDate > dateNow || res.closingHour == null)){    
          setCanVote(true)
        }
      }).catch(err => {
        console.log("Error", err)
      })
    }, []);

    return (
        <div>
        { voting && voting.length !== 0 && !votingHasExpired() ? 
          <div>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <div>
            <Card className=".card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Votación
                </Typography>
                <Typography variant="h5" component = "h2">
                  {voting.title}
                </Typography>
                <br/>
                <Typography variant="body2" component="p">
                  {voting.description}
                </Typography>
                <br/>
                <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                  {voting.openingHour}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <br/>
          <Divider />
          <br/>
          <div id="voting_options_id" name="voting_options">
            <Card>
              <CardContent>
                  <FormControl component="fieldset" className=".formControl">
                    <RadioGroup aria-label="options" name="options" value={radioValue} onChange={handleRadioChange}>
                      { createOptions(voting.options) }  
                    </RadioGroup>
                  { canVote && currentUser && voting ? 
                  <Button
                    onClick = {handleSubmit}
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="button"
                    endIcon={<Icon>send</Icon>}>
                    Enviar votación
                  </Button> : <div>
                    <Button
                    type="text"
                    variant="contained"
                    color="secondary"
                    className="button"
                    endIcon={<Icon>warning</Icon>}>
                      No puedes votar ahora mismo
                    </Button>
                    </div>}
                  </FormControl>
              </CardContent>
            </Card>
          </div>
          <Snackbar open={formError} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Selecciona una opción
            </Alert>
          </Snackbar>
          <Snackbar open={voteSuccess} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              ¡Ha votado correctamente!
            </Alert>
          </Snackbar>
        </div>
        : <div>

        </div> }
      </div>
      );
    }

export default VotingDetailUser