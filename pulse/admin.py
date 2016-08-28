from django.contrib import admin

# Register your models here.
from pulse.models import HeartrateSession, MeanHeartrate

class HeartrateSessionAdmin(admin.ModelAdmin):
	list_display = ['date_time', 'mean_heartrates' ]

	class Meta:
		model = HeartrateSession

	def mean_heartrates(self, obj):
		res = HeartrateSession.objects.get(id=obj.id).meanheartrate_set.values()
		return res

admin.site.register(HeartrateSession, HeartrateSessionAdmin)