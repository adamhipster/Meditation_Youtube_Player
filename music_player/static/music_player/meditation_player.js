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
        start_counter = 0;
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
    document.querySelector('button').addEventListener('click', function () { 
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
                'songs': [ids[0], ids[1]]
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



//UNUSED / BACKUP

function submitVideoIds(vid1, vid2) {
    //TO DO: check if video is playable functionality is broken. I have to manually test that for now.
    if(start_counter == 0){
        ids = [vid1, vid2];
        // setTimeout(function () {
        //     checkIfVideoPlayable(vid1);
        //     console.log("after checkIfVideoPlayable: " + unplayable_video + " " + vid1);
        // }, 1000);
        // setTimeout(function () {
        //     //checkIfVideoPlayable(vid2);
        //     console.log("after checkIfVideoPlayable: " + unplayable_video + " " + vid2);
            setSecondVideoTime();
        //     update("updated_ids", "video_ids", ids);
        // }, 1000);
    }
}