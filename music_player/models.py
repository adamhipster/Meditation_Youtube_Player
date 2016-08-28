from django.db import models

# Create your models here.
class MeditationSession(models.Model):
	date = models.DateField()
	time = models.TimeField()
	duration = models.IntegerField()

	def __str__(self):
		return "session " + str(self.id) + " @ " + str(self.time) + str(self.date)


class Song(models.Model):
	session = models.ForeignKey(MeditationSession)
	song = models.CharField(max_length=32)