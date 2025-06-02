from channels.generic.websocket import AsyncWebsocketConsumer
from api import models, serializers
from loguru import logger
import json
from . import helper
import datetime
#connect with postamn using this url man
#ws://localhost:8000/ws/rider/<put some primary key>
#You must add CHANNEL_LAYERS in settings to allow group communication
#see ouput in terminal for clear understanding

"""
Channel layers have a purely async interface (for both send and receive);
you will need to wrap them in a converter if you want to call them from
synchronous code.
"""

class Rider(AsyncWebsocketConsumer):
    async def connect(self):
        self.rider_id = self.scope['url_route']['kwargs']['rider_id']
        self.group_name = "riders"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        rider = await models.Rider.objects.aget(id=self.rider_id)
        self.rider_details = dict(serializers.RiderRegisterSerializer(rider).data)
        logger.info(f"[RIDER CONNECTED] ID: {self.rider_id}")
        logger.debug(f"[RIDER DETAILS] {self.rider_details}")
        self.no_of_drivers=0

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("price"):
            source_location_data=helper.get_address_details(data.get("source")) #gives address,latitude.longtude
            destination_location_data=helper.get_address_details(data.get("destination")) 
            data["source_latitude"],data["source_longitude"],data["source_details"]=source_location_data.get("latitude"),source_location_data.get("longitude"),source_location_data.get("details")
            data["destination_latitude"],data["destination_longitude"],data["destination_details"]=destination_location_data.get("latitude"),destination_location_data.get("longitude"),destination_location_data.get("details")
            self.estimated_duration=helper.get_duration()
            self.distance=helper.get_distance((data["source_latitude"],data["source_longitude"]),(data["destination_latitude"],data["destination_longitude"]))
            self.price=helper.get_price()
            data["price"]=self.price
            data["estimated_duration"]=self.estimated_duration
            data["distance"]=self.distance
            ride_request = {**self.rider_details, **data, "from": self.channel_name}
            ride_request["price_details"]="1"
            await self.send(text_data=json.dumps(ride_request))


        elif data.get("review"):
            logger.info(f"[RIDER REVIEW RECEIVED] {data}")
            rider = await models.Rider.objects.aget(id=self.rider_id)
            driver = await models.Driver.objects.aget(id=data.get("driver_id",""))
            await models.RideDetails.objects.acreate(
                rider=rider,
                driver=driver,
                source=data.get("source", ""),
                destination=data.get("destination", ""),
                estimated_duration=self.estimated_duration,
                distance=self.distance,
                price=self.price,
                payment_mode=data.get("payment_mode", "cash"),
                status=False,
                review_cleanliness=data.get("review_cleanliness", False),
                review_discipline=data.get("review_discipline", False),
                review_friendly=data.get("review_friendly", False),
                review_safety=data.get("review_safety", False),
                review_arrive_on_time=data.get("review_arrive_on_time", False),
                ride_rating=data.get("ride_rating", 2),
                favourite=data.get("favourite",0)
            )
        else:
            # Rider sends request
            source_location_data=helper.get_address_details(data.get("source")) #gives address,latitude.longtude
            destination_location_data=helper.get_address_details(data.get("destination"))
            intermediate_location_data={
                "latitude":"0.0.0.0",
                "longitude":"0.0.0.0",
                "details":"Intermediate,not yet written"
            }
            data["source_latitude"],data["source_longitude"],data["source_details"]=source_location_data.get("latitude"),source_location_data.get("longitude"),source_location_data.get("details")
            data["destination_latitude"],data["destination_longitude"],data["destination_details"]=intermediate_location_data.get("latitude"),intermediate_location_data.get("longitude"),intermediate_location_data.get("details")
            self.estimated_duration=helper.get_duration()
            self.distance=helper.get_distance((data["source_latitude"],data["source_longitude"]),(data["destination_latitude"],data["destination_longitude"]))
            self.price=helper.get_price()
            data["price"]=self.price
            data["estimated_duration"]=self.estimated_duration
            data["distance"]=self.distance
            ride_request = {**self.rider_details, **data, "from": self.channel_name}
            logger.info(f"[RIDER REQUEST SENT] {ride_request}")
            self.data1=data.copy()
            await self.channel_layer.group_send("drivers", {
                "type": "receive_ride_request",
                "message": ride_request
            })
            data2=data.copy()
            data2["source_latitude"] = intermediate_location_data.get("latitude")
            data2["source_longitude"] = intermediate_location_data.get("longitude")
            data2["source_details"] = intermediate_location_data.get("details")
            data2["destination_latitude"] = destination_location_data.get("latitude")
            data2["destination_longitude"] = destination_location_data.get("longitude")
            data2["destination_details"] = destination_location_data.get("details")
            self.estimated_duration = helper.get_duration()
            self.distance = helper.get_distance((data2["source_latitude"], data2["source_longitude"]),(data2["destination_latitude"], data2["destination_longitude"]))
            self.price = helper.get_price()
            data2["price"] = self.price
            data2["estimated_duration"] = self.estimated_duration
            data2["distance"] = self.distance
            data2["arrive_at"] = self.estimated_duration + datetime.now().time()
            self.data2=data2.copy()
            ride_request = {**self.rider_details, **data2, "from": self.channel_name}
            await self.channel_layer.group_send("drivers", {
                "type": "receive_ride_request",
                "message": ride_request
            })



    async def request_accepted(self, event):
        logger.success(f"[RIDER MATCHED] DRIVER RESPONSE: {event['message']}")
        self.no_of_drivers+=1
        if self.no_of_drivers==1:
            self.driver1=event["message"]
        if self.no_of_drivers==2:
            self.driver2=event["message"]
            await self.send(text_data=json.dumps({"driver1":self.driver1} | {"driver1":self.driver2}))

    async def ride_completed(self, event):
        self.no_of_drivers=0
        await self.send(text_data=json.dumps(event["message"]))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        logger.warning("[RIDER DISCONNECTED]")


class Driver(AsyncWebsocketConsumer):
    async def connect(self):
        self.driver_id = self.scope['url_route']['kwargs']['driver_id']
        self.group_name = "drivers"
        self.rider_channel_name = None
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        driver = await models.Driver.objects.aget(id=self.driver_id)
        self.driver_details = dict(serializers.DriverRegisterSerializer(driver).data)
        self.driver_details["available"] = "1"
        logger.info(f"[DRIVER CONNECTED] ID: {self.driver_id}")
        logger.debug(f"[DRIVER DETAILS] {self.driver_details}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        logger.info(f"[DRIVER MESSAGE] {data}")
        if data.get("ready") == "1":
            self.driver_details["available"] = "0"
            message = {**self.driver_details, "from": self.channel_name}
            if self.rider_channel_name:
                # Notify matched rider
                await self.channel_layer.send(self.rider_channel_name, {
                    "type": "request_accepted",
                    "message": message
                })
                # Notify other drivers
                await self.channel_layer.group_send(self.group_name, {
                    "type": "notify_ride_taken",
                    "message": {"ride_already_taken": "1"}
                })

        elif data.get("ready") == "0":
            self.driver_details["available"] = "1"
            # Notify rider to leave a review
            if self.rider_channel_name:
                await self.channel_layer.send(self.rider_channel_name, {
                    "type": "ride_completed",
                    "message": {"review": "1", "driver_id": self.driver_id}
                })

            logger.info(f"[DRIVER COMPLETED RIDE] ID: {self.driver_id}, Available for next ride.")

    async def receive_ride_request(self, event):
        if self.driver_details.get("available") == "1":
            self.rider_channel_name = event["message"]["from"]
            await self.send(text_data=json.dumps(event["message"]))
            logger.success(f"[DRIVER RECEIVED REQUEST] {event['message']}")

    async def notify_ride_taken(self, event):
        # Notify only other drivers
        if self.channel_name != self.rider_channel_name:
            await self.send(text_data=json.dumps(event["message"]))

    async def disconnect(self, close_code):
        self.driver_details["available"] = "1"
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        logger.warning("[DRIVER DISCONNECTED]")
        
