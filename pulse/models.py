from django.db import models
from music_player.models import MeditationSession


# Create your models here.

class HeartrateSession(models.Model):
	date_time = models.DateTimeField(auto_now_add=True, blank=True)
	meditation_session = models.OneToOneField(MeditationSession, blank=True, null=True)

class MeanHeartrate(models.Model):
	date_time = models.DateTimeField(auto_now_add=True, blank=True)
	session = models.ForeignKey(HeartrateSession)
	heartrate = models.IntegerField()
