from channels.generic.websocket import AsyncWebsocketConsumer
from api import models, serializers
from loguru import logger
import json
from . import helper
from datetime import datetime,timedelta
#connect with postamn using this url man
#ws://localhost:8000/ws/rider/split_rides/<put some primary key>
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
        self.rider_details = dict(serializers.RiderSerializer(rider).data)
        logger.info(f"[RIDER CONNECTED] ID: {self.rider_id}")
        logger.debug(f"[RIDER DETAILS] {self.rider_details}")
        self.no_of_drivers=0

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("price"):
            current_time = datetime.now()
            # Format the time as a string in "09:30" format
            start_time = current_time.strftime("%H:%M")
            # Rider sends request
            info1,details1=helper.get_coordinates(data.get("source"))
            
            info2,details2=helper.get_coordinates(data.get("destination"))
            
            
            ride_data = helper.calculate_trip_details(details1,details2,info1,info2,start_time) 
            data["source_latitude"],data["source_longitude"],data["source_details"]=ride_data.get("source_latitude"),ride_data.get("source_longitude"),ride_data.get("source_details")
            data["destination_latitude"],data["destination_longitude"],data["destination_details"]=ride_data.get("destination_latitude"),ride_data.get("destination_longitude"),ride_data.get("destination_details")
            self.estimated_duration=ride_data["estimated_duration"]
            self.distance=ride_data["distance"]
            self.price=ride_data["price"]
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
            current_time = datetime.now()
            # Format the time as a string in "09:30" format
            start_time = current_time.strftime("%H:%M")
            # Rider sends request
            info1,details1=helper.get_coordinates(data.get("source"))
            info2,details2=(12.9176571, 77.4837568),"Mantri Square, Sampige Road, Seshadripuram, Sriramapura, Bengaluru, Bangalore North, Bengaluru Urban, Karnataka, 560021, India"
            info3,details3=helper.get_coordinates(data.get("destination"))
            
            ride_data = helper.calculate_trip_details(details1,details2,info1,info2,start_time) 
            data["source_latitude"],data["source_longitude"],data["source_details"]=ride_data.get("source_latitude"),ride_data.get("source_longitude"),ride_data.get("source_details")
            data["destination_latitude"],data["destination_longitude"],data["destination_details"]=ride_data.get("destination_latitude"),ride_data.get("destination_longitude"),ride_data.get("destination_details")
            self.estimated_duration=ride_data["estimated_duration"]
            self.distance=ride_data["distance"]
            self.price=ride_data["price"]
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
            ride_data = helper.calculate_trip_details(details2,details3,info2,info3,start_time) 
            data["source_latitude"],data["source_longitude"],data["source_details"]=ride_data.get("source_latitude"),ride_data.get("source_longitude"),ride_data.get("source_details")
            data["destination_latitude"],data["destination_longitude"],data["destination_details"]=ride_data.get("destination_latitude"),ride_data.get("destination_longitude"),ride_data.get("destination_details")
            self.estimated_duration=ride_data["estimated_duration"]
            self.distance=ride_data["distance"]
            self.price=ride_data["price"]
            data["price"]=self.price
            data["estimated_duration"]=self.estimated_duration
            data["distance"]=self.distance
            estimated_duration_minutes = helper.parse_duration_to_minutes(self.estimated_duration)
            # Get the current time
            current_time = datetime.now()
            # Create a timedelta object for the estimated duration
            duration_timedelta = timedelta(minutes=estimated_duration_minutes)
            # Calculate the arrival time
            data["arrive_at"] = str((current_time + duration_timedelta).time())
            self.data2=data.copy()
            ride_request = {**self.rider_details, **data, "from": self.channel_name}
            await self.channel_layer.group_send("drivers", {
                "type": "receive_ride_request",
                "message": ride_request
            })



    async def request_accepted(self, event):
        logger.success(f"[RIDER MATCHED] DRIVER RESPONSE: {event['message']}")
        self.no_of_drivers+=1
        print("NO OF DRIVERS",self.no_of_drivers)
        if self.no_of_drivers==1:
            self.driver1=event["message"]
        if self.no_of_drivers==2:
            self.driver2=event["message"]
            await self.send(text_data=json.dumps({"driver1":self.driver1,"driver2":self.driver2}))

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
        self.driver_details = dict(serializers.DriverSerializer(driver).data)
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
        
