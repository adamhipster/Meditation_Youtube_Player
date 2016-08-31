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

class MeditationSettings(models.Model):
	modified = models.DateTimeField(auto_now=True)
	vid1 = models.CharField(default = 'YQlyHbu0zz4', max_length=32)
	vid2 = models.CharField(default = 'QoitiIbdeaM', max_length=32)
	countdown_time = models.IntegerField(default = 3600)
	display_favorites_text = models.BooleanField(default = False)
	display_heart_detector = models.BooleanField(default = False)

	def __str__(self):
		return '{} {} {} {} {}'.format(self.vid1, self.vid2, self.countdown_time, self.display_favorites_text, self.display_heart_detector)
