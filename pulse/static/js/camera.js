var camera = (function(){
  var htracker;
  var video, canvas, context, videoPause, canvasOverlay, overlayContext;
  var countdownCanvas, countdownContext, rawDataGraph;
  var renderTimer, dataSend, workingBuffer, heartbeatTimer;
  var width = 380;
  var height = 285;
  var fps = 15;
  var heartrate = 60;
  var bufferWindow = 512;
  var sendingData = false;
  var red = [];
  var green = [];
  var blue = [];
  var pause = false;
  var spectrum;
  var h, x, y, line, xAxis;
  var heartrateAverage = [];
  var heartrateStored = [];
  var circle, circleSVG, r;
  var toggle = 1;
  var hrAv = 65;
  var graphing = false;
  const STORED_HEARTRATES_AMNT = 60;
  var newSession = true;
  var faceFound = false;
  var userAgreesWithFaceTrack = false;

  function initVideoStream(){
    video = document.createElement("video");
    video.setAttribute("width", width);
    video.setAttribute("height", height);

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    // ** for showing/hiding arrow ** 
    var hidden = document.getElementById("arrow");
    var buttonBar = document.getElementById("buttonBar");
    var allowWebcam = document.getElementById("allowWebcam");

    if (navigator.getUserMedia){
      navigator.getUserMedia({
        video: true,
        audio: false
      }, function(stream){
        if (video.mozSrcObject !== undefined) { // for Firefox
          video.mozSrcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream); 
        }
        hidden.style.display = "none";
        hidden.className = "";
        allowWebcam.style.display = "none";

        buttonBar.className = "button";

        initCanvas(); 
      }, errorCallback);
      };
  };

  function initCanvas(){
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    context = canvas.getContext("2d");
    
    canvasOverlay = document.getElementById("canvasOverlay");
    canvasOverlay.setAttribute("width", width);
    canvasOverlay.setAttribute("height", height);
    overlayContext = canvasOverlay.getContext("2d");
    overlayContext.clearRect(0,0,width,height);

    var button = document.getElementById("end_camera");
    button.style.display = "block";

    startCapture();
  };

  function headtrack (){      
    htracker = new headtrackr.Tracker({detectionInterval: 1000/fps});
    htracker.init(video, canvas, context);
    htracker.start();

    // ** for each facetracking event received draw rectangle around tracked face on canvas ** 
    document.addEventListener("facetrackingEvent", greenRect);
    document.addEventListener("headtrackrStatus", faceTrackingStatus); //for facetrackingagreement
  };

  function greenRect(event) {
    // ** clear canvas ** 
    overlayContext.clearRect(0,0,width,height);

    var sx, sy, sw, sh, forehead, inpos, outpos;
    var greenSum = 0;
    var redSum = 0;
    var blueSum = 0;
    
    // ** approximating forehead based on facetracking ** 
    sx = event.x + (-(event.width/5)) + 20 >> 0;
    sy = event.y + (-(event.height/3)) + 10 >> 0;
    sw = (event.width/5) >> 0;
    sh = (event.height/10) >> 0;

    //  ** CS == camshift (in headtrackr.js) ** 
    //  ** once we have stable tracking, draw rectangle ** 
    if (event.detection == "CS") /**/ {
      overlayContext.rotate(event.angle-(Math.PI/2));
      overlayContext.strokeStyle = "#00CC00";
      overlayContext.strokeRect(event.x + (-(event.width/2)) >> 0, event.y + (-(event.height/2)) >> 0, event.width, event.height);
      
      //  ** for debugging: blue forehead box ** 
      overlayContext.strokeStyle = "#33CCFF";       
      overlayContext.strokeRect(sx, sy, sw, sh);

      forehead = context.getImageData(sx, sy, sw, sh);
      
      // ** turn green ** 
      for (i = 0; i < forehead.data.length; i+=4){
        // ** for reference: ** 
        // var red = forehead.data[i];
        // var green = forehead.data[i+1];
        // var blue = forehead.data[i+2];
        // var alpha = forehead.data[i+3];

        //  ** for debugging: puts a green video image on screen ** 
        // forehead.data[i] = 0;
        // forehead.data[i + 1] = forehead.data[i]
        // forehead.data[i + 2] = 0;

        // ** get sum of green area for each frame **
        // ** FOR RGB CHANNELS & ICA **
        redSum = forehead.data[i] + redSum;
        greenSum = forehead.data[i+1] + greenSum;
        blueSum = forehead.data[i+2] + blueSum;
        
        // // ** TOGGLE FOR GREEN CHANNEL ONLY **
        // greenSum = forehead.data[i+1] + greenSum;
      };

      // ** get average of green area for each frame **

      // ** FOR RGB CHANNELS & ICA **
      var redAverage = redSum/(forehead.data.length/4);
      var greenAverage = greenSum/(forehead.data.length/4);
      var blueAverage = blueSum/(forehead.data.length/4);

      // //  ** TOGGLE FOR GREEN CHANNEL ONLY **
      // var greenAverage = greenSum/(forehead.data.length/4);

      // //  ** TOGGLE FOR GREEN CHANNEL ONLY **
      // if (green.length < bufferWindow){
      //     green.push(greenAverage);
      //   if (green.length > bufferWindow/8){
      //       sendingData = true;
      //   }
      // } else {
      //   green.push(greenAverage);
      //   green.shift();
      // }

      // ** FOR RGB CHANNELS & ICA **
      if (green.length < bufferWindow){
          red.push(redAverage);
          green.push(greenAverage);
          blue.push(blueAverage);
        if (green.length > bufferWindow/8){
            sendingData = true;
        }
      } else {
        red.push(redAverage);
        red.shift();
        green.push(greenAverage);
        green.shift();
        blue.push(blueAverage);
        blue.shift();
      }
      

      // ** for debugging: puts green video image on screen **
      // overlayContext.putImageData(forehead, sx, sy);

      overlayContext.rotate((Math.PI/2)-event.angle);
    }
  };

  function drawCountdown(array){
    countdownContext.font = "20pt Helvetica";
    countdownContext.clearRect(0,0,200,100);
    countdownContext.save();
    countdownContext.fillText(((bufferWindow - array.length)/fps) >> 0, 25, 25);
    countdownContext.restore();
  };


  function cardiac(array, bfwindow){
    // ** if using Green Channel, you can normalize data in the browser: ** 
    // var normalized = normalize(array);
    // var normalized = array;

    // // ** fast fourier transform from dsp.js **
    // // ** if using green channel, you can run fft in the browser: **
    // var fft = new RFFT(bfwindow, fps);
    // fft.forward(normalized);
    // spectrum = fft.spectrum;

    // ** if FFT is done on server, set spectrum to that array **
    spectrum = array;

    var freqs = frequencyExtract(spectrum, fps);
    var freq = freqs.freq_in_hertz;
    heartrate = freq * 60;
    
    // //** TOGGLE FOR GREEN CHANNEL ONLY **
    // graphData = {one: green[green.length-1]}
    // graph.series.addData(graphData);
    // graph.render();

    heartbeatCircle(heartrate);
    
    // ** create an average of the last five heartrate 
    // measurements for the pulsing circle ** 
    if (heartrateAverage.length < 4){
      heartrateAverage.push(heartrate);
      hrAV = heartrate;
    } else {
      heartrateAverage.push(heartrate);
      console.log(heartrateAverage);
      heartrateAverage.shift();
      hrAv = mean(heartrateAverage);
    }
    if (heartrateStored.length < STORED_HEARTRATES_AMNT){
      heartrateStored.push(heartrate);
    }
    if (heartrateStored.length == STORED_HEARTRATES_AMNT){
      //by logging heartrate activity intermittently, I don't need to
      //edit this program to send everything all at once.
      var m = Number(mean(heartrateStored).toFixed(0));
      sendToDatabase(m, newSession);
      heartrateStored = [];
      newSession = false;
    }
  }

  function heartbeatCircle(heartrate){
    var cx = $("#heartbeat").width() / 2;
    var cy = $("#heartbeat").width() / 2;
    r = $("#heartbeat").width() / 4;

    if (circle) {
      circleSVG.select("text").text(heartrate >> 0);

    } else {
      circleSVG = d3.select("#heartbeat")
                    .append("svg")
                    .attr("width", cx * 2)
                    .attr("height", cy * 2);
      circle = circleSVG.append("circle")
                        .attr("cx", cx)
                        .attr("cy", cy)
                        .attr("r", r)
                        .attr("fill", "#DA755C");
      circleSVG.append("text")
               .text(heartrate >> 0)
               .attr("text-anchor", "middle")
               .attr("x", cx )
               .attr("y", cy + 10)
               .attr("font-size", "26pt")
               .attr("fill", "white");   
    }
  }

  //deleted var confidenceGraph, showConfidenceGraph() and clearConfidenceGraph()

  function startCapture(){
    video.play();

    // ** if the video is paused, reset everything so that the data collection process restarts ** 
    if (pause == true){
      pause = false;
      red = [];
      green = [];
      blue = []; 
    }
    
    // ** set the framerate and draw the video the canvas at the desired fps ** 
    renderTimer = setInterval(function(){
        context.drawImage(video, 0, 0, width, height);
      }, Math.round(1000 / fps));


    // ** send data via websocket to the python server ** 
    dataSend = setInterval(function(){
      // //  ** TOGGLE FOR GREEN CHANNEL ONLY **
      // if (sendingData){
      //   sendData(JSON.stringify({"array": green, "bufferWindow": green.length}));
      // }
      // ** FOR RGB CHANNELS & ICA **
      if (sendingData && userAgreesWithFaceTrack){
        sendData(JSON.stringify({"array": [red, green, blue], "bufferWindow": green.length}));
      }

    }, Math.round(1000));

    // ** pulse the round cirle containing the heartrate 
    // to an average of the last five heartrate measurements **
    heartbeatTimer = setInterval(function(){
      var duration = Math.round(((60/hrAv) * 1000)/4);
      if (toggle % 2 == 0){
          circleSVG.select("circle")
                 .transition()
                 .attr("r", r)
                 .duration(duration);
        } else {
          circleSVG.select("circle")
                 .transition()
                 .attr("r", r + 15)
                 .duration(duration);
        }
        if (toggle == 10){
          toggle = 0;
        }
        toggle++;
    }, Math.round(((60/hrAv) * 1000)/2));


    // ** begin headtracking! ** 
    headtrack();
  };

  function pauseCapture(){
    // ** clears timers so they don't continue to fire ** 
    if (renderTimer) clearInterval(renderTimer);
    if (dataSend) clearInterval(dataSend);
    if (heartbeatTimer) clearInterval(heartbeatTimer);

    pause = true;
    sendingData = false;
    video.pause();

    // ** removes the event listener and stops headtracking ** 
    document.removeEventListener("facetrackingEvent", greenRect);
    htracker.stop();

    //added by mettamage
    faceFound = false;
    resetFacetrackingAgreement();
  };

  function faceTrackingStatus(headtrackrEvent) {
    if(headtrackrEvent.status == "found"){
      faceFound = true;
      var text = "Click Here To Agree With Camera Settings";
      $("#facetracking_agreement").html(text);
      document.getElementById("facetracking_agreement").disabled = false;
    }
  }

  function agreeWithFacetracking(){
    if(faceFound){
      userAgreesWithFaceTrack = true;
      // console.log("agreement is set!");
      var text = "Agreement Is Set!";
      $("#facetracking_agreement").html(text); 
    }
  };

  function resetFacetrackingAgreement(){
    userAgreesWithFaceTrack = false;
    var text = "Initializing camera settings";
    $("#facetracking_agreement").html(text);
    document.getElementById("facetracking_agreement").disabled = true;
  }

  var errorCallback = function(error){
    console.log("something is wrong with the webcam!", error);
  }; 

  return{
    init: function(){
      initVideoStream();
    },
    start: startCapture,
    pause: pauseCapture,
    cardiac: cardiac,
    agree: agreeWithFacetracking,
  }

})();

