from django.contrib import admin


# Register your models here.
from music_player.models import MeditationSession, Song

class MeditationSessionAdmin(admin.ModelAdmin):
	list_display = ['date', 'time', 'duration', 'youtube_ids' ]

	class Meta:
		model = MeditationSession

	def youtube_ids(self, obj):
		song1 = MeditationSession.objects.get(id=obj.id).song_set.values()[0]['song']
		song2 = MeditationSession.objects.get(id=obj.id).song_set.values()[1]['song']
		return song1 + ', ' + song2

admin.site.register(MeditationSession, MeditationSessionAdmin)