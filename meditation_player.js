//standard video settings.
var ids = ["YQlyHbu0zz4", "QoitiIbdeaM"];
var vid_times = ["60:00", "10:00"]; //10:00 is placeholder.
var countdown_time = 3600;

//The youtube part from tutorial: http://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript/
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 400,
        height: 200,
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    setSecondVideoTime();
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
    }, 1000);
}

//http://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
function fromSecondsToFormattedTime(time){
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
        var timer = new CountDownTimer(countdown_time);
        var timeObj = CountDownTimer.parse(countdown_time);
        format(timeObj.minutes, timeObj.seconds);
        timer.onTick(format).onTick(playSongs);
        timer.start(); 
        console.log(vid_times);
    });
    
    function format(minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ':' + seconds;
    }
    
// own functions start from here
    function playSongs(){
        if(display.innerHTML == vid_times[0]){
            startSong(ids[0]);
        }
        if(display.innerHTML == vid_times[1]){
            startSong(ids[1]);
        }
    }
    
    function startSong(id){
        player.unMute();
        player.cueVideoById(id);
        player.playVideo();
    }

};

function submitVideoIds(vid1, vid2){
    ids = [vid1, vid2];
    setSecondVideoTime();
    update("updated_ids", "video_ids", ids);
}

function changeCountDownTime(time){
    vid_times[0] = fromSecondsToFormattedTime(time);
    countdown_time = time;
    update_var = fromSecondsToFormattedTime(time);
    update("updated_time", "video_times", update_var);
}

function update(element_id, hook_element_id, update_var){
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