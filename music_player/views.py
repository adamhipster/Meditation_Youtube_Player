from django.shortcuts import render
from .models import MeditationSession, Song
from pulse.models import HeartrateSession

# Create your views here.
def meditation(request):
	if request.method == 'POST':
		pa = request.POST # pa = post_args
		duration = pa.get('duration')
		time = pa.get('time')
		date = pa.get('date')
		songs = pa.getlist('songs[]')
		is_hearttracking = pa.getlist('is_hearttracking')
		ms = MeditationSession.objects.create(date = date, time = time, duration = duration) 
		Song.objects.create(session = ms, song = songs[0])
		Song.objects.create(session = ms, song = songs[1])
		if is_hearttracking[0] == "true":
			hs = HeartrateSession.objects.latest('date_time')
			hs.meditation_session = ms
			hs.save()

	return render(request, "meditation.html", {})

