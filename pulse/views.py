from django.shortcuts import render
from .models import HeartrateSession, MeanHeartrate
from datetime import datetime

# Create your views here.
def pulse(request):
	return render(request, "splash.html", {})

def pulse_begin(request):
	return render(request, "index.html", {})


def pulse_data(request):
	if request.method == 'POST':
		pa = request.POST
		new_session = pa.get('new_session')
		heartrate = pa.get('mean_heartrate') #mean heartrate of 60 seconds
		if new_session == "true":
			print("new session started")
			hs = HeartrateSession.objects.create()
			MeanHeartrate.objects.create(session = hs, heartrate = heartrate)
		else:
			print ("session still contuining")
			hs = HeartrateSession.objects.last()
			MeanHeartrate.objects.create(session = hs, heartrate = heartrate)

	return render(request, "index.html", {})


