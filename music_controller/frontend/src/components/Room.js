// Room.js
import React, { Component } from "react";
import {Grid, Button, Typography } from '@material-ui/core';
import { useParams, useNavigate } from "react-router-dom"; //these hooks get reed of the router.
import CreateRoomPage from "./CreateRoomPage";
class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false
        };
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);



    }

    componentDidMount(){
        this.getRoomDetails();
    }

    getRoomDetails() {
        return fetch('/api/get-room' + '?code=' + this.props.roomCode).then((res) => {
            if (!res.ok) {
                this.props.leaveRoomCallback();
                this.props.navigate('/');
            }
            return res.json();
        }).then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
        });
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch('/api/leave-room', requestOptions). then((_response) => {
            this.props.leaveRoomCallback();
            this.props.navigate('/');
        });
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    }

    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={this.state.votesToSkip} 
                        guestCanPause={this.state.guestCanPause} 
                        roomCode={this.roomCode} 
                        //updateCallback={} 
                    />
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(false)}>Close</Button>
                </Grid>
            </Grid>
        )
    }
    //method to render settings button. Don't hard code it since it can only show if the user is host
    renderSettingsButton() {
        return (
            <Grid item xs={12} align='center'>
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)}>Settings</Button>
            </Grid>
        )
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Typography variant="h4" component='h4'>
                        Code: {this.props.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                <Typography variant="h6" component='h6'>
                        Votes: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                <Typography variant="h6" component='h6'>
                        Guest Can Pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                <Typography variant="h6" component='h6'>
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align='center'>
                <Button 
                    variant = 'contained'
                    color="secondary"
                    onClick={this.leaveButtonPressed}
                    > Leave Room </Button>
                </Grid>
            </Grid>
            );
    }
}

export default (props) => {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    return <Room {...props} roomCode={roomCode} navigate={navigate} />;
}; //use props and hooks to do the job of router.
