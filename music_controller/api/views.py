from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
#these are all endpoints (a location on the webserver)

def main(request):
    return HttpResponse('Hello')