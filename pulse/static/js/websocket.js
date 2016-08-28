var dataSocket = new WebSocket("ws://"+ location.host + "/echo");

dataSocket.onopen = function(){
	console.log("websocket open!");
}

dataSocket.onmessage =  function(e){
	var data = JSON.parse(e.data);
	console.log("parsing onmessage event: ");
	console.log(e);

	if (data.id === "ICA"){
		camera.cardiac(data.array, data.bufferWindow);
	}

}

function sendData(data){
	console.log("function send data call");
	console.log(data);
	dataSocket.send(data);
}

dataSocket.onclose = function(){
	console.log('closed');
}