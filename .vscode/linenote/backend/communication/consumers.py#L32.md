# PRICE
- From : rider frontend **(recieve)**
- To : rider frontend **(send)**
- Format recieve : 
```
{
 "price" : "1" ,
 "source" : "RV College",
 "destination" : "2nd stage Peenya"
}
 ```
- Format sent : 
```
{   "price_details":"1"
    "source": "RV College Of Engineering",
    "destination": "Peenya 2nd Stage",
    "source_latitude": 12.924066,
    "source_longitude": 77.4982484,
    "source_details": "A: RV College of Engineering, Bangalore-Mysore Road, BDA Jnanabharathi Residential Enclave, Kengeri, Mailasandra, Bangalore South, Bengaluru Urban, Karnataka, 560059, India",
    "destination_latitude": 13.0283168,
    "destination_longitude": 77.5129632,
    "destination_details": "Peenya 2nd Stage, Nagasandra, Bengaluru, Bangalore North, Bengaluru Urban, Karnataka, 560058, India",
    "price": 100,
    "estimated_duration" : 120,
    "distance" : 11.47
} + rider details+channel
```