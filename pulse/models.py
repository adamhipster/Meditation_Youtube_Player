from django.db import models

# Create your models here.

class HeartrateSession(models.Model):
	date_time = models.DateTimeField(auto_now_add=True, blank=True)

class MeanHeartrate(models.Model):
	session = models.ForeignKey(HeartrateSession)
	heartrate = models.IntegerField()
