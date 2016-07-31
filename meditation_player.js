//standard video settings.
var ids = ["YQlyHbu0zz4", "QoitiIbdeaM"];
var vid_times = ["60:00", "10:00"]; //10:00 is placeholder.
var countdown_time = 3600;
var start_counter = -1; //will be set at 0 when necessary things are initialized
var unplayable_video;

//The youtube part from tutorial: http://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript/
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
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
        if(unplayable_video) { alert("video " + vid + " is unplayable. Reset the web page and choose another video")};
        console.log("checkIfVideoPlayable: " + unplayable_video);
    }, 650); 
}

function setSecondVideoTime() {
    player.mute();
    player.cueVideoById(ids[1]);
    player.playVideo();
    setTimeout(function () {
        var second_vid_duration = Math.floor (player.getDuration() );
        var formattedTime = fromSecondsToFormattedTime(second_vid_duration);
        vid_times[1] = formattedTime;
        player.stopVideo();
        start_counter = 0;
    }, 1000);               //pause is needed because Youtube only loads metadata when the video is played.
}

//http://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
function fromSecondsToFormattedTime(time) {
    var parsedTime = CountDownTimer.parse(time);
    function str_pad_left(string,pad,length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    }
    var finalTime = str_pad_left(parsedTime.minutes,'0',2)+':'+str_pad_left(parsedTime.seconds,'0',2);
    return finalTime;
}

//Timer part from: http://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
window.onload = function () {
    var display = document.querySelector('#time');
    document.querySelector('button').addEventListener('click', function () { 
        if(start_counter == 0){
            var timer = new CountDownTimer(countdown_time);
            var timeObj = CountDownTimer.parse(countdown_time);
            format(timeObj.minutes, timeObj.seconds);
            timer.onTick(format).onTick(playSongs);
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
    
// own functions start from here
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

};

function submitVideoIds(vid1, vid2) {
    if(start_counter == 0){
        ids = [vid1, vid2];
        setTimeout(function () {
            checkIfVideoPlayable(vid1);
            console.log("after checkIfVideoPlayable: " + unplayable_video + " " + vid1);
        }, 700);
        setTimeout(function () {
            checkIfVideoPlayable(vid2);
            console.log("after checkIfVideoPlayable: " + unplayable_video + " " + vid2);
            setSecondVideoTime();
            update("updated_ids", "video_ids", ids);
        }, 1400);
    }
}

function changeCountDownTime(time) {
    if (start_counter == 0){
        vid_times[0] = fromSecondsToFormattedTime(time);
        countdown_time = time;
        update_var = fromSecondsToFormattedTime(time);
        update("updated_time", "video_times", update_var);
        time_element = document.getElementById("time");
        time_element.innerHTML = update_var;
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