from django.shortcuts import render
from .models import MeditationSession, Song, MeditationSettings
from pulse.models import HeartrateSession
import json

# Create your views here.
def meditation(request):
	mSettings = getMeditationSettings()
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

	context = getMeditationSettingsContext(mSettings)
	print(mSettings)
	print(context)
	return render(request, "meditation.html", {'context':json.dumps(context)})

def meditation_settings(request):
	mSettings = getMeditationSettings()
	if request.method == 'POST':
		pa = request.POST
		for key in pa:
			value = pa[key]
			print("value = ", value)
			value = True if value in 'true' else False if value in 'false' else value
			print("value = ", value)
			setattr(mSettings, key, value)
		mSettings.save()
	context = getMeditationSettingsContext(mSettings)
	return render(request, "meditation.html", {'context':json.dumps(context)})

#GETTERS / HELPER METHODS

def getMeditationSettings():
	mSettings = None
	if MeditationSettings.objects.first() == None:
		mSettings = MeditationSettings.objects.create()
	else:
		mSettings = MeditationSettings.objects.first()
	return mSettings


def getMeditationSettingsContext(ms):
	context = {
		'vid1':ms.vid1,
		'vid2':ms.vid2,
		'countdown_time':ms.countdown_time,
		'display_favorites_text':ms.display_favorites_text,
		'display_heart_detector':ms.display_heart_detector,
	}
	return context