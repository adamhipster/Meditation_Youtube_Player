from django.shortcuts import render

# Create your views here.
def meditation(request):
	return render(request, "meditation.html", {})