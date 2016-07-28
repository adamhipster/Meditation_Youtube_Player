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
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }
  var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
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
  console.log(ids);
}

function changeCountDownTime(time){
  vid_times[0] = fromSecondsToFormattedTime(time);
  countdown_time = time;
  console.log(vid_times, countdown_time);
}

//submitVideoTimes deprecated
function submitVideoTimes(vid_time1, vid_time2){
    vid_times = [vid_time1, vid_time2];
  console.log(vid_times);
}
