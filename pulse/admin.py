from django.contrib import admin

# Register your models here.
from pulse.models import HeartrateSession, MeanHeartrate

class HeartrateSessionAdmin(admin.ModelAdmin):
	list_display = ['date_time', 'id', 'mean_heartrates', 'meditation_session']

	class Meta:
		model = HeartrateSession

	def mean_heartrates(self, obj):
		vals = HeartrateSession.objects.get(id=obj.id).meanheartrate_set.values()
		res = ''
		for val in vals:
			res = res + str(val['heartrate']) + ' '
		#return vals #for debug
		return res

admin.site.register(HeartrateSession, HeartrateSessionAdmin)