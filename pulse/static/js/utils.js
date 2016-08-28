function sendToDatabase(meanHeartrate, newSession) {
	$.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            }
        }
    });
    var data = {
    	'mean_heartrate': meanHeartrate,
    	'new_session': newSession,
    }
    $.ajax
    ({
        "type": "POST",
        "dataType": "json",
        "url": "/pulse/data",
        "data": data,
    });
	console.log ("Database send: " + meanHeartrate);
}

