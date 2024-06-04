from django.db import models
import string
import random

# Create your models here.
#fat models and thin views. Most logic in the models.


def generate_unique_code():
    length = 6

    while True: 
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        #querry and look at all the rooms 
        if Room.objects.filter(code = code).count() == 0:
            break
    return code

class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True) #one host per room
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)
