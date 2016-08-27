from django.shortcuts import render
from .models import MeditationSession, Song 

# Create your views here.
def meditation(request):
	if request.method == 'POST':
		pa = request.POST # pa = post_args
		duration = pa.get('duration')
		time = pa.get('time')
		date = pa.get('date')
		songs = pa.getlist('songs[]')
		ms = MeditationSession.objects.create(date = date, time = time, duration = duration) 
		Song.objects.create(session = ms, song = songs[0])
		Song.objects.create(session = ms, song = songs[1])		

	return render(request, "meditation.html", {})

def pulse(request):
	return render(request, "splash.html", {})

def pulse_begin(request):
	return render(request, "index.html", {})


