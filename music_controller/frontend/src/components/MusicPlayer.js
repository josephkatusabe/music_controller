import React, { Component } from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.pauseSong = this.pauseSong.bind(this);
        this.playSong = this.playSong.bind(this);
    }

    skipSong() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        };
        fetch('/spotify/skip', requestOptions);
    }

    pauseSong() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('/api/pause-song', requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Error pausing the song', response.statusText);
                }
            })
            .catch(error => console.error('Error:', error));
    }
    
    playSong() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('/api/play-song', requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Error playing the song', response.statusText);
                }
            })
            .catch(error => console.error('Error:', error));
    }
    

    render() {
        const { title, artist, duration, time, image_url, is_playing } = this.props;

        if (!title || !artist || !duration || !time || !image_url) {
            return null;
        }

        const songProgress = (time / duration) * 100;

        return (
            <Card>
                <Grid container alignItems='center'>
                    <Grid item align='center' xs={4}>
                        <img src={image_url} alt="Album cover" height='100%' width="100%" />
                    </Grid>
                    <Grid item align='center' xs={8}>
                        <Typography component="h5" variant='h5'>
                            {title}
                        </Typography>
                        <Typography color="textSecondary" variant='subtitle1'>
                            {artist}
                        </Typography>
                        <div>
                            <IconButton onClick={is_playing ? this.pauseSong : this.playSong}>
                                {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <IconButton onClick={() => this.skipSong()}>
                                {this.props.votes} /{' '} { this.props.votes_required} <SkipNextIcon />
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
                <LinearProgress variant='determinate' value={songProgress} />
            </Card>
        );
    }
}
