from channels.consumer import SyncConsumer

class Rider(SyncConsumer):

    def websocket_connect(self, event):
        print("Rider connected...")
        self.send({
            "type": "websocket.accept",
        })

    def websocket_receive(self, event):
        print("Message received...")
        self.send({
            "type": "websocket.send",
            "text": event["text"],
        })