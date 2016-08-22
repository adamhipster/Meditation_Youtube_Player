from django.db import models

# Create your models here.
class MeditationSession(models.Model):
	date = models.DateField()
	time = models.TimeField()
	duration = models.IntegerField()



class Song(models.Model):
	session = models.ForeignKey(MeditationSession)
	song = models.CharField(max_length=32)