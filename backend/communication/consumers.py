from channels.consumer import SyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
#connect with postamn using this url man
#wss://localhost:8000/ws/rider/
#You must add CHANNEL_LAYERS in settings to allow group communication
#to check working of channels type http://localhost:8000/static/chat.html
#see ouput in terminal for clear understanding
from colorama import Back, init
init()
#Back.some_color
#Fore.some_color
"""
Channel layers have a purely async interface (for both send and receive)
; you will need to wrap them in a converter if you want to call them from
synchronous code.
"""





#WORKING
class Rider(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print(Back.GREEN +"Rider connected...")
        print(Back.GREEN+ f"Channel name {self.channel_name}")
        print(Back.GREEN +f"Channel layer {self.channel_layer}...")
        print(Back.GREEN +f"Channel layer alias {self.channel_layer_alias}...")
        # for k, v in self.scope['headers']:
        #     print(f"{k.decode()}: {v.decode()} ...")
        self.group_name=self.scope['url_route']['kwargs']['group_name']
        await self.channel_layer.group_add(
            self.group_name, #in this particular group
            self.channel_name #add this particular channel
        )

    async def receive(self,text_data=None):
        print(Back.YELLOW +f"received content :{text_data}...")
        message=f'''
            "from" : {self.channel_name},
            "text_data":text_data 
        '''
        # await self.send(text_data=message)
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":"chat_message", #this means call the chat_message function
                "message":message
            }
        )

    async def disconnect(self,close_code=None):
        print(Back.RED + "Disconnected...")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def chat_message(self,event):
        message = event['message'] #this message variable is a dictionary
        message += f' "to":{self.channel_name}'
        print(Back.WHITE+f"Channel name: {self.channel_name}")
        print(Back.WHITE+f"message:{message}")
        #print(Back.LIGHTMAGENTA_EX + f"Event parameter: {event}")
        await self.send(text_data=message)
        
 
#WORKING
class DriverSyncConsumer(SyncConsumer):

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