from channels.consumer import SyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
#connect with postamn using this url man
#ws://localhost:8000/ws/rider/<put some primary key>
#You must add CHANNEL_LAYERS in settings to allow group communication
#see ouput in terminal for clear understanding
from colorama import Fore, Back, Style, init
import json
from api import models
from api import serializers
init()
"""
Channel layers have a purely async interface (for both send and receive)
; you will need to wrap them in a converter if you want to call them from
synchronous code.
"""

class Rider(AsyncWebsocketConsumer):
    async def connect(self):
        """When frontend connects with rider"""
        await self.accept()
        self.rider_id = self.scope['url_route']['kwargs']['rider_id']
        self.group_name='riders'
        await self.channel_layer.group_add(self.group_name,self.channel_name )
        rider=await models.Rider.objects.aget(id=self.rider_id)
        serializer=serializers.RiderRegisterSerializer(rider)
        self.rider_details=serializer.data
        #in this particular group #add this particular channel
        print(Back.BLUE + Fore.WHITE + f"[RIDER] Connected , Name:{self.rider_id}")
        print("[RIDER] Details :",self.rider_details)

    async def receive(self,text_data=None):
        """Receive message from Rider frontend."""
        frontend_message=json.loads(text_data)
        message=self.rider_details | frontend_message
        message["from"]=self.channel_name
        print(Back.YELLOW + Fore.BLACK + f"[RIDER] Sent message: {message}")

        '''From rider channel sends request to driver group'''
        await self.channel_layer.group_send(
            "drivers",{
                "type":"request_driver", #this means call the chat_message function
                "message":message
            }
        )

    async def request_accepted(self,event):
        """Receive response from driver (via direct send)."""
        print(Back.GREEN + Fore.BLACK + f"[RIDER] Got response from DRIVER → {event['message']}")
        await self.send(text_data=json.dumps(event['message']))

    async def disconnect(self,close_code=None):
        print(Back.RED + Fore.WHITE + "[RIDER] Disconnected")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)


class Driver(AsyncWebsocketConsumer):
    async def connect(self):
        '''Connect from driver frontend'''
        await self.accept()
        self.group_name='drivers'
        self.driver_id = self.scope['url_route']['kwargs']['driver_id']
        await self.channel_layer.group_add(self.group_name,self.channel_name )
        #in this particular group #add this particular channel
        driver=await models.Driver.objects.aget(id=self.driver_id)
        serializer=serializers.DriverRegisterSerializer(driver)
        self.driver_details=serializer.data
        self.rider_channel_name=None
        print(Back.CYAN + Fore.BLACK + f"[DRIVER] Connected , Name:{self.driver_id}")
        print("[DRIVER] Details :",self.driver_details)
        

    async def receive(self,text_data=None):
        """Receive message from Driver frontend."""
        received_message=json.loads(text_data)
        print(Back.YELLOW + Fore.BLACK + f"[DRIVER] Sent message: {text_data}")
        if received_message["ready"]=="1":
            message=self.driver_details | { "from":self.channel_name }
            self.driver_details["available"]= "0" #that is he is ready to accept
            '''Driver channel is sending to Rider channel'''
            if self.rider_channel_name:
                await self.channel_layer.send(
                    self.rider_channel_name,{
                        "type":"request_accepted",
                        "message":message
                    }
                )
        elif received_message["ready"]=="0":#that is he sends message from frontend that his ride completed
            self.driver_details["available"]=="1" #he is ready for other rides

    async def request_driver(self, event):
        """Triggered when a rider sends a request."""
        if str(self.driver_details["available"]) == "1":
            await self.send(text_data=json.dumps(event['message']))
            self.rider_channel_name=event["message"]["from"]
             #convert a Python dict into a JSON string
            print(Back.GREEN + Fore.BLACK + f"[DRIVER] Got request from RIDER → {event['message']}")
        else:
            return

    async def disconnect(self,close_code=None):
        self.driver_details["available"]=="1"
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(Back.RED + Fore.WHITE + "[DRIVER] Disconnected")
