# RECEIVE FROM RIDER CHANNEL
- From : rider channel  **(rider receive -> group_send)**
- To : Driver frontend **(self.send())**
- format : ***json*** of exact rider message
- before sending checks if driver available
```
{
    "id": 14,
    "name": "siri",
    "email": "siri@gmail.com",
    "phone_number": "123",
    "source": "RV College Of Engineering",
    "destination": "Peenya 2nd Stage",
    "source_latitude": 12.924066,
    "source_longitude": 77.4982484,
    "source_details": "A: RV College of Engineering, Bangalore-Mysore Road, BDA Jnanabharathi Residential Enclave, Kengeri, Mailasandra, Bangalore South, Bengaluru Urban, Karnataka, 560059, India",
    "destination_latitude": 13.0283168,
    "destination_longitude": 77.5129632,
    "destination_details": "Peenya 2nd Stage, Nagasandra, Bengaluru, Bangalore North, Bengaluru Urban, Karnataka, 560058, India",
    "from": "specific..inmemory!XeKauHGAhBQQ"
}
```