import React, { useEffect, useState } from 'react';
import AuthService from "../services/auth.service";
import VotingDataService from "../services/voting.service";
import { Icon, Typography, FormControl, RadioGroup, FormHelperText, Button, FormControlLabel, Radio, Card, CardContent, Divider } from "@material-ui/core"

function VotingDetailUser() {
    
  const [currentBar, setCurrentBar] = useState({})
  const [radioValue, setRadioValue] = useState()
  const [formError, setFormError] = useState(false)
  const [helperText, setHelperText] = useState("Elige bien!")
  const [voting, setVoting] = useState({})
  const currentToken = AuthService.getCurrentUser().accessToken
  
    const handleSubmit = (event) => {
      
    }

    const handleRadioChange = (event) => {
      event.persist()

      setRadioValue(event.target.value)
      setHelperText(" ")
      setFormError(false)
    }

    const createOptions = (options) => {
      let res = [];

      if(!options || options.length === 0) {
        res.push(<Icon>info</Icon>,<Typography> Sin opciones disponibles</Typography>)
      }else{
        for (let i = 0; i < options.length; i++) {
          res.push(<FormControlLabel key={options[i].id.toString()} value={options[i].id.toString()} control={<Radio />} label={options[i].nombre}/>)
        }
      }

      return res;
    }

    useEffect(() => {
      //This is sample code. Replace with real data
      VotingDataService.getVoting(1, currentToken).then(res => {
        console.log(currentToken)
        setVoting(res)
      }).catch(err => {
        console.log("Error", err.response.status)
      })
    }, []);

    return (
        <div>
        { voting && voting.length !== 0 ? 
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
                <form onSubmit={handleSubmit}>
                  <FormControl component="fieldset" error={formError} className=".formControl">
                    <RadioGroup aria-label="options" name="options" value={radioValue} onChange={()=>handleRadioChange()}>
                      {createOptions(voting.options)}  
                    </RadioGroup>
                    <FormHelperText>{helperText}</FormHelperText>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="button"
                    endIcon={<Icon>send</Icon>}>
                    Enviar votación
                  </Button>
                  </FormControl>
                </form>
              </CardContent>
            </Card>
          </div>
        </div> : <div></div> }
      
      </div>
      );
    }

export default VotingDetailUser