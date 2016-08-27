from channels.routing import route
from pulse.consumers import ws_message

channel_routing = [
	route("websocket.receive", ws_message, path=r"^/echo$"),
]
