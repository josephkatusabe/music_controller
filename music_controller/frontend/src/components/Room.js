// Room.js
import React, { Component } from "react";
import { withRouter } from "./withRouter"; // Import the withRouter utility

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };
        // Access the route parameters from props.router.params
        this.roomCode = this.props.router.params.roomCode;
        this.getRoomDetails();
    }

    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode).then((res) => 
        res.json()
        ).then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
        });
    }

    render() {
        return (
            <div>
                <h3>{this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
                <p>Host: {this.state.isHost.toString()}</p>
            </div>
        );
    }
}

export default withRouter(Room); // Export the component wrapped with withRouter
