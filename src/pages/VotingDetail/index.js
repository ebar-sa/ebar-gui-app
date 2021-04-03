import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router"
import VotingDataService from "../../services/votings.service";
import { Icon, Typography, FormControl, RadioGroup, Button, FormControlLabel, Radio, Card, CardContent, Snackbar } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';
import useUser from '../../hooks/useUser'

function VotingDetailUser(props) {
    
  const [radioValue, setRadioValue] = useState("0")
  const [voteSuccess, setVoteSuccess] = useState(false)
  const [voteFailure, setVoteFailure] = useState(false)
  const [formError, setFormError] = useState(false)
  const [voting, setVoting] = useState({})
  const [canVote, setCanVote] = useState(false)
  const {auth} = useUser()
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
        VotingDataService.vote(voting.id, radioValue, auth.accessToken)
          .catch((error) => {
            setVoteFailure(true)
          })
          .then((res) => {
            if (res && res.status == 200) {
              setCanVote(false)
              setVoteSuccess(true)
              history.push("/votings")
            } else {
              setVoteFailure(true)
            }
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

    const votingHasExpired = () => {
      let res = false

      if (voting.closingHourc && toDateFromString(voting.closingHour) < Date.now()) {
          res = true
      }
    
      return res
    }

    useEffect(() => {
      const votingId = props.match.params.votingId

      VotingDataService.getVoting(votingId, auth.accessToken).then(res => {
        setVoting(res)

        let dateNow = Date.now()
        let schDate = false
        let sohDate = false

        sohDate = toDateFromString(res.openingHour)
        
        if (res.closingHour != null) {
          schDate = toDateFromString(res.closingHour)
        }

        if (!res.votersUsernames.includes(auth.username)
        && sohDate < dateNow
        && (schDate > dateNow || res.closingHour == null)){    
          setCanVote(true)
        }
      }).catch(err => {
        console.log("Error", err)
      })
    }, [auth.accessToken, auth.username, props.match.params.votingId]);

    return (
        <div>
        { auth && voting && voting.length !== 0 && !votingHasExpired() ? 
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
          <div id="voting_options_id" name="voting_options">
            <Card>
              <CardContent>
                  <FormControl component="fieldset" className=".formControl">
                    <RadioGroup aria-label="options" name="options" value={radioValue} onChange={handleRadioChange}>
                      {voting.options && voting.options.length !== 0 ? voting.options.map((option, idx) => (
                        <FormControlLabel key={option.id.toString()} value={option.id.toString()} control={<Radio />} label={option.description}/>
                      )) : 
                      <div >
                        <div style={{float:"left", paddingRight:"10px"}}>
                        <Icon>info</Icon>
                        </div>
                        <div style={{float:"right"}}>
                        <Typography> Sin opciones disponibles</Typography>
                        </div>
                      </div>}
                    </RadioGroup>
                  { canVote && auth && voting ?     
                  <Button
                    id="vote_btn"
                    onClick = {handleSubmit}
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="button"
                    endIcon={<Icon>send</Icon>}>
                    Enviar votación
                  </Button> : <div>
                    <Button
                    id="cannot_vote_btn"
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
          <Snackbar open={voteFailure} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Ups, ha habido un error al votar... Inténtalo de nuevo
            </Alert>
          </Snackbar>
        </div>
        : <div id="empty_page">
        </div> }
      </div>
      );
    }

export default VotingDetailUser