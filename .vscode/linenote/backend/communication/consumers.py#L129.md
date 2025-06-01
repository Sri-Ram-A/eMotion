# COMPLETES RIDE
- from : driver frontend **(recieve)**
- to : rider for review **(ride_completed)**
- driver becomes available
- format received :
```
{"ready":"0"}
```
- format sent : 
```
{
    "review": "1",
    "driver_id": self.driver_id
}
```