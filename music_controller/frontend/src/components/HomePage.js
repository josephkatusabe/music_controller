import React, {Component} from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from './Room';
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Link, 
    Redirect 
} from "react-router-dom";

//Create a simple Home component to display the home page.
function Home() {
    return <p>This is the home page</p>;
}

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('Component rendering')
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/join" element={<RoomJoinPage />} />
                    <Route path="/create" element={<CreateRoomPage />} />
                    <Route path="/room/:roomCode" element={<Room />} />

                </Routes>
            </Router>
        );
    }
}