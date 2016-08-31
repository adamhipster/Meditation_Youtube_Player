//GLOBAL VARS
var hasToChangeSettings = false;

//FUNCTIONS FOR SETTINGS
$(document).on('click', '.settings', processSettings);

function processSettings(event){
    var element = event.target;
    if(element.nodeName == "LABEL"){
        hasToChangeSettings = (element.children[0].id == 'option2')? true : false;
    }
    if(hasToChangeSettings){
        if(element.nodeName == "BUTTON"){
            switch(element.id){
                case 'favorites_button':
                    processFavoritesButton();
                break;
                case 'enable_camera_button':
                    processEnableCameraButton(element);
                break;
                case 'video_ids_submit':
                    processVideoIdsSubmit();
                break;
                case 'video_times_submit':
                    processVideoTimesSubmit();
                break;
            }
        }
    }
}

function uploadToDatabase(data) {
    $.ajax
    ({
        "type": "POST",
        "dataType": "json",
        "url": "meditation_settings/",
        "data": data,
    }); 
    console.log("Upload to database!");
    console.log(data);
}

function processFavoritesButton() {
    var el = document.getElementById('favorites_text');
    if(el.style.display == 'none'){
        uploadToDatabase({'display_favorites_text': false});
    }
    else{
        uploadToDatabase({'display_favorites_text': true});
    }
}

function processEnableCameraButton(button) {
    var el = document.getElementById('camera_iframe');
    if (el) {
        uploadToDatabase({'display_heart_detector': true});
    }
    else {
        uploadToDatabase({'display_heart_detector': false});
    }
}

function processVideoIdsSubmit() {
    var vid1 = ifURLExtractId(document.getElementById('vid1').value);
    var vid2 = ifURLExtractId(document.getElementById('vid2').value);
    uploadToDatabase({'vid1' : vid1, 'vid2' : vid2});
}

function ifURLExtractId(vid) {
    if(vid.indexOf("youtube") > -1){
        var pos = vid.indexOf("v=");
        id = vid.slice(pos+2, vid.indexOf("&"));
        vid = id;
    }
    return vid;
}

function processVideoTimesSubmit() {
    var countdownTime = document.getElementById('meditation_time').value;
    uploadToDatabase({'countdown_time' : countdownTime});
}




















