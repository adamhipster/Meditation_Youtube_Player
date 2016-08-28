//standard video settings.
var ids = ["YQlyHbu0zz4", "QoitiIbdeaM"];
var vid_times = ["60:00", "10:00"]; //10:00 is placeholder.
var countdown_time = 3600;
var start_counter = -1; //will be set at 0 when necessary things are initialized
var unplayable_video;
var is_hearttracking = false;

//The youtube part from tutorial: http://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript/
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video_placeholder', {
        width: 400,
        height: 200,
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    setSecondVideoTime();
}

function onPlayerStateChange(event) {
    console.log(event);
    if(event.data == 1){
        unplayable_video = false;
        console.log("onPlayerStateChange: " + unplayable_video);
    }
}

function checkIfVideoPlayable(vid) {
    player.mute();
    player.cueVideoById(vid);
    unplayable_video = true;
    player.playVideo();
    setTimeout(function () {
        player.stopVideo();
        if(unplayable_video) { alert("video " + vid + " is unplayable. Reset the web page and choose another video")}
        console.log("checkIfVideoPlayable: " + unplayable_video);
    }, 950); 
}

function setSecondVideoTime() {
    player.mute();
    player.cueVideoById(ids[1]);
    player.playVideo();
    setTimeout(function () {
        var second_vid_duration = player.getDuration(); //TO DO: deleted Math.Floor. It seems to work but add it again to be sure.
        console.log("second_vid_duration: " + second_vid_duration);
        var formattedTime = fromSecondsToFormattedTime(second_vid_duration);
        vid_times[1] = formattedTime;
        player.stopVideo();
        if(vid_times[1] == "00:00"){
            console.log("ERROR -- Video time of 2nd video: " + vid_times[1]);
            alert("Something went wrong loading the song time of the 2nd video. Please reload the page.");
        }
        else{
            start_counter = 0;
        }
    }, 1000);               //pause is needed because Youtube only loads metadata when the video is played.
    console.log(vid_times);
}

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

//http://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
function fromSecondsToFormattedTime(time) {
    var parsedTime = CountDownTimer.parse(time);
    
    var finalTime = str_pad_left(parsedTime.minutes,'0',3)+':'+str_pad_left(parsedTime.seconds,'0',2);
    console.log("FinalTime: " + finalTime);
    var finalTime = finalTime[0]=="0"?finalTime.substr(1,finalTime.length):finalTime; //trim the 0 away that was too much, e.g. 005:24.
    return finalTime;
}

//Timer part from: http://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
window.onload = function () {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            }
        }
    });
    var display = document.querySelector('#time');
    document.querySelector('#countdown_button').addEventListener('click', function () { 
        if(start_counter == 0){
            var timer = new CountDownTimer(countdown_time);
            var timeObj = CountDownTimer.parse(countdown_time);
            format(timeObj.minutes, timeObj.seconds);
            timer.onTick(format).onTick(playSongs).onTick(storeSession);
            timer.start();
            start_counter++;
        }
        else if (start_counter == -1){
            alert("Youtube data is still loading, you clicked a bit too fast. Now it should be finished.");
        }
    });
    
    function format(minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ':' + seconds;
    }

    function playSongs() {
        if(display.innerHTML == vid_times[0]){
            startSong(ids[0]);
        }
        if(display.innerHTML == vid_times[1]){
            startSong(ids[1]);
        }
    }
    
    function startSong(id) {
        player.unMute();
        player.cueVideoById(id);
        player.playVideo();
    }

    function storeSession() {
        //see: http://coreymaynard.com/blog/performing-ajax-post-requests-in-django/ 
        if(display.innerHTML == "00:00" && countdown_time >= 1)
        {
            var dt = new Date();
            var data = {
                'duration': countdown_time, 
                'time': str_pad_left(dt.getHours(),'0',2) + ':' + str_pad_left(dt.getMinutes(),'0',2), 
                'date': dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() , 
                'songs': [ids[0], ids[1]],
                'is_hearttracking': is_hearttracking,
            };
            $.ajax
            ({
                "type": "POST",
                "dataType": "json",
                "url": "/",
                "data": data,
            }); 
        }
    }
}; //end onload

//HTML TRIGGERS

function changeCountDownTime(time) {
    if (start_counter == 0){
        vid_times[0] = fromSecondsToFormattedTime(time);
        countdown_time = time;
        update_var = fromSecondsToFormattedTime(time);
        update("updated_time", "video_times", update_var);
        time_element = document.getElementById("time");
        time_element.innerHTML = update_var;
        console.log(vid_times);
    }
}

function update(element_id, hook_element_id, update_var) {
    var div = document.createElement('div');
    div.setAttribute("id", element_id);
    var text = document.createTextNode("updated: " + update_var);
    div.appendChild(text);
    var hook_element = document.getElementById(hook_element_id).nextSibling;
    var parent_node = hook_element.parentNode;
    var found_div = document.getElementById(element_id);
    parent_node.insertBefore(div, hook_element);
    if(found_div != null){ parent_node.removeChild(found_div); }
}

function submitVideoIds(vid1, vid2) {
    if(start_counter == 0){
        vid1 = ifURLExtractId(vid1);
        vid2 = ifURLExtractId(vid2);
        ids = [vid1, vid2];
        setSecondVideoTime();
    }
}

function ifURLExtractId(vid) {
    if(vid.indexOf("youtube") > -1){
        var pos = vid.indexOf("v=");
        id = vid.slice(pos+2, vid.indexOf("&"));
        vid = id;
    }
    return vid;
}


//HTML UI
function toggleDisplay(buttonSelector, textSelector) {
    var text = document.querySelector(textSelector);
    var display;

    function tg(display, text){
        if (display != 'none'){
            text.style.display = 'none';
        }
        else {
            text.style.display = 'block';
        }
        return text;
    }

    try{
        display = text.style.display;
        text = tg(display, text);
    }
    catch(err){
        console.log("toggledisplay catch: " + err);
        text.style.display = '';
        display = text.style.display;
        tg(display, text);
    }

}

function toggleIframe(buttonSelector) {
    function HeartrateEventListeners(){
        var doc = document.getElementById(id).contentWindow.document;
        doc.getElementById("facetracking_agreement").addEventListener("click", function(){
            is_hearttracking = true;
            console.log("click facetracking_agreement! Heartracking is " + is_hearttracking);
        });
        doc.getElementById("end_camera").addEventListener("click", function(){
            is_hearttracking = false;
            console.log("click end_camera! Heartracking is " + is_hearttracking);
        });

    }
    var wrapper= document.createElement('div');
    wrapper.innerHTML= "<iframe id='camera_iframe' src='http://localhost:8000/pulse/begin'></iframe>";
    var iframe = wrapper.firstChild;
    var id = iframe.getAttribute("id");
    var domIframe = document.getElementById(id); 
    if(!domIframe){
        var vidHolder = document.getElementById("video_placeholder");
        var parentVid = vidHolder.parentNode;
        var index = Array.prototype.indexOf.call(parentVid.children, vidHolder);
        parentVid.insertBefore(iframe, parentVid.children[index+1]);
        setTimeout(HeartrateEventListeners, 1000);
    }
    //document.getElementById("camera_iframe").contentWindow.document.getElementById("facetracking_agreement")
}


// //generic function (not used)
// function toggleIframe(buttonSelector, iframeHTML ) {
//     var wrapper= document.createElement('div');
//     wrapper.innerHTML= iframeHTML;
//     var iframe = wrapper.firstChild;
//     var id = iframe.getAttribute("id");
//     var domIframe = document.getElementById(id); 
//     if(!domIframe){
//         var vidHolder = document.getElementById("video_placeholder");
//         var parentVid = vidHolder.parentNode;
//         var index = Array.prototype.indexOf.call(parentVid.children, vidHolder);
//         parentVid.insertBefore(iframe, parentVid.children[index+1]);
//     }

// }



