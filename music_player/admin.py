from django.contrib import admin


# Register your models here.
from music_player.models import MeditationSession, Song, MeditationSettings

class MeditationSessionAdmin(admin.ModelAdmin):
	list_display = ['date', 'time', 'duration', 'youtube_ids' ]

	class Meta:
		model = MeditationSession

	def youtube_ids(self, obj):
		song1 = MeditationSession.objects.get(id=obj.id).song_set.values()[0]['song']
		song2 = MeditationSession.objects.get(id=obj.id).song_set.values()[1]['song']
		return song1 + ', ' + song2

class MeditationSettingsAdmin(admin.ModelAdmin):
	list_display = ['modified','vid1','vid2','countdown_time','display_favorites_text','display_heart_detector']

	class Meta:
		Model = MeditationSettings





admin.site.register(MeditationSession, MeditationSessionAdmin)
admin.site.register(MeditationSettings, MeditationSettingsAdmin)