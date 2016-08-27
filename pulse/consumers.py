from django.http import HttpResponse
from channels.handler import AsgiHandler
import pulse.model as model
import json

#routed via ^/echo$
def ws_message(message):
	# ASGI WebSocket packet-received and send-packet message types
	# both have a "text" key for their textual data.
	# message.content = {'text': 'hello world', 'order': 1, 'path': '/echo', 'reply_channel': 'websocket.send!RgrOlPjc'}

	msg_content = json.loads(message.content["text"])
	# print(msg_content) # e.g.: {'array': [[125.55, 115.11, 114.33, 115.44]], 'bufferWindown': 4}

	signals = model.parse_RGB(msg_content)

	message.reply_channel.send({
		"text": signals,
	})

