from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)

    if expires_in is not None:
        expires_in = timezone.now() + timedelta(seconds=int(expires_in))
    else:
        # Handle the case where expires_in is None, possibly by logging an error or setting a default
        expires_in = timezone.now() + timedelta(seconds=3600)  # Set default expiration time (1 hour)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token or tokens.refresh_token  # Keep the old refresh token if a new one is not provided
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False

def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        refresh_token = tokens.refresh_token
        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,  # Corrected 'refresh_toke' to 'refresh_token'
            'client_id': CLIENT_ID,  # Corrected 'cleint_id' to 'client_id'
            'client_secret': CLIENT_SECRET  # Corrected 'cleint_secret' to 'client_secret'
        }).json()

        access_token = response.get('access_token')
        token_type = response.get('token_type')
        expires_in = response.get('expires_in')
        new_refresh_token = response.get('refresh_token')

        if not access_token or not token_type or not expires_in:
            # Log an error or handle the case where the response is incomplete
            raise ValueError("Failed to refresh Spotify token: missing data in response")

        # Update the tokens, use the new refresh token if provided, otherwise keep the old one
        update_or_create_user_tokens(session_id, access_token, token_type, expires_in, new_refresh_token or refresh_token)
