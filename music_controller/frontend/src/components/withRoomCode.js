import React from 'react';
import { useParams } from 'react-router-dom';

function withRoomCode(Component) {
  return function WrappedComponent(props) {
    const { roomCode } = useParams();
    return <Component {...props} roomCode={roomCode} />;
  };
}

export default withRoomCode;
