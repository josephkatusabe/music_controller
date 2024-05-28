import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CreateRoomPage extends Component {
    defaultVotes = 2;
    constructor(props) {
        super(props);
        //when you update, it is rerender.
        this.state = {
            guestCanpause: true,
            votesToSkip: this.defaultVotes,
        };

        this.hundleRoomButtonPressed = this.hundleRoomButtonPressed.bind(this);
        this.hundleVotesChange = this.hundleVotesChange.bind(this);
        this.hundleGuestsCanPauseChange = this.hundleGuestsCanPauseChange.bind(this);
    }

    hundleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    hundleGuestsCanPauseChange(e) {
        this.setState ({
            guestCanpause: e.target.value === 'true' ? true : false,
        });
    }

    hundleRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanpause
            }),
        };
        fetch('/api/create-room', requestOptions).then((res) => res.json()
        ).then((data) => console.log(data))
    }

    render() {
        return <Grid container spacing={1}>
            <Grid item xs={12} align='center'>
                <Typography component='h4' variant="h4">
                    Create a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align='center'>
                <FormControl component='fieldset'>
                    <FormHelperText >
                        <div align='center'>
                            Guest Control of Playback state
                        </div>
                    </FormHelperText>
                    <RadioGroup row 
                        defaultValue='true' 
                        onChange={this.hundleGuestsCanPauseChange}
                    >
                        <FormControlLabel 
                            value='true' 
                            control={<Radio color="primary" />}
                            label = "Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value='false' 
                            control={<Radio color="secondary" />}
                            label = "No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align='center'>
                <FormControl>
                    <TextField 
                        required={true} 
                        type="number" 
                        onChange={this.hundleVotesChange}
                        defaultValue={this.defaultVotes} 
                        inputProps={{
                            min: 1,
                            style: {textAlign: 'center'}
                        }}
                    />
                    <FormHelperText>
                        <div align='center'>
                            Votes required to Skip song.
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align='center'>
                <Button color="primary" variant="contained" onClick={this.hundleRoomButtonPressed}>
                        Create A Room
                    </Button>
            </Grid>
            <Grid item xs={12} align='center'>
                <Button color="secondary" variant="contained" to='/' component={Link}>
                     Back
                    </Button>
            </Grid>
        </Grid>
    };
}