
//FUNCTIONS FOR SETTINGS
$(document).on('click', '.settings', processSettings);

function processSettings(event){
    var element = event.target;
    var hasToChangeSettings = false;
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
                    processEnableCameraButton();
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
        "url": "/",
        "data": data,
    }); 
}
function processFavoritesButton() {
    var el = document.getElementById('favorites_text');
    if(el.style.display == 'none'){
        uploadToDatabase('favorites_text': false);
    }
    else{
        uploadToDatabase('favorites_text': true);
    }
}

function processEnableCameraButton() {
    //need to think about this
}

function processVideoIdsSubmit() {
    var vid1, vid2 = document.getElementById('vid1').value, document.getElementById('vid2').value);
}

function processVideoTimesSubmit() {
    var countdownTime = document.getElementById('meditation_time').value;
}




















