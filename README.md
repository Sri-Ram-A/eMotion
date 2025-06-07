# 🚗 eMotion - Ride Sharing Application
## 🛠️ Prerequisites

To run this project, make sure you have the following installed:

* ✅ Node.js and npm
* ✅ Python 3.x (for Django backend)
* ✅ Android Studio with SDKs installed (preferably Pixel 6)
* ✅ ngrok (for exposing local server to the internet)
* ✅ Expo CLI (for running the React Native apps)

  ```bash
  npm install -g expo-cli
  ```

---

## 📁 Project Structure

```
eMotion/
├── backend/ 
    |── api/ # http://
    |── backend/ # settings.py
    |── communication/    # ws://           
├── frontend-driver/       
└── frontend-rider/       
```

Each frontend has its own `api.ts` config file to switch between `localhost` and `ngrok`.

---

## 🚀 Setup Instructions

### 🔧 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

> **Note:** Make sure you’ve configured `CHANNEL_LAYERS` in `settings.py` to enable WebSocket group communication.In this project I am using `daphne` channels **IN MEMORY**
Any changes in `settings.py` has been shown using triple hash (###)

---

### 📱 2. Android Studio Setup

1. Download & install Android Studio and open freshly
2. Go to `More Actions > Virtual Device Manager`
3. Create **two Pixel 6 virtual devices**:

   * One named `Driver`
   * One named `Rider` *(You can clone the first by clicking the 3 dots > Duplicate)*

---

### ⚛️ 3. Frontend Setup

```bash
# Install frontend dependencies
cd frontend-driver
npm install

cd ../frontend-rider
npm install
```

---

## 🏃‍♂️ Running the Application

### ✅ Option 1: Using ngrok (Recommended)

1. Start Django server

```bash
cd backend
python manage.py runserver
```

2. In a new terminal, start ngrok (use your ngrok domain if needed)

```bash
ngrok http --url=cub-true-shiner.ngrok-free.app http://127.0.0.1:8000/
```
> **NOTE** : The static port tunneling url given to me by ngrok is `cub-true-shiner.ngrok-free.app` , you must create an account in *ngrok* to create your own urls :
[Ngrok Login](https://dashboard.ngrok.com/login)

> **Make sure to update** the ngrok domain in both `api.ts` files:
>
> * `frontend-driver/services/api.ts`
> * `frontend-rider/services/api.ts`

3. Launch the apps in emulators
```bash
# In Terminal 1
cd frontend-driver
npm start
# Press 'Shift + a' and choose the 'Driver' emulator

# In Terminal 2
cd frontend-rider
npm start
# Press 'Shift + a' and choose the 'Rider' emulator
```

---

### 🖥️ Option 2: Using Localhost

If you're running everything locally without ngrok:

1. Open `api.ts` in both frontend apps.
2. Uncomment the **localhost** block:

```ts
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const BASE_API_URL = `http://${HOST}:8000/api/driver/`;
export const SOCKET = `ws://${HOST}:8000/ws/driver/`; // or rider
```

> 🔁 *Android* emulators (unlike web and ios) use `10.0.2.2` instead of `localhost`

---

## 📡 WebSocket Information

### 📌 Routes (Defined in `backend/routing.py`)
> 🔁 Use `re_path` if `path()` fails to match optional parameters or dynamic patterns.
- re_path(r'^ws/rider(?:/(?P< group_name >\w+))?/?$', consumers.Rider.as_asgi()),
- #path('ws/rider/< str:name >', consumers.Rider.as_asgi()), 

### 🌐 WebSocket Connection Example
To connect via Postman or custom tools:

```
ws://localhost:8000/ws/rider/<rider_id>
```
OR
```
wss://cub-true-shiner.ngrok-free.app/ws/rider/<rider_id>
```

### 📂 File Locations

* `routing.py`: URL routes for WebSockets
* `consumers.py`: Async WebSocket consumers
* `split_rides_consumers.py`: Handles split ride logic
* `helper.py`: Any utility/helper functions for WebSockets

---

## 📝 API Documentation

### 📍 Driver Status Updates

```json
// To mark driver as ready to accept ride
{
  "ready": 1
}

// To mark driver as ride completed
{
  "ready": 0,
  "driver_id": "123"
}
```
### 📍 Rider Status Updates

```json
// To initiate rider to get drivers
{
  "source": "Majestic",
  "destination": "Aakash Coaching Centre,Rajajinagar"
}

// after driver sends ({"review":"1"})
{
  "favourite": 1,
  "rating":4, ..
  "discipline": "1" ....
}
```

You can use tools like **Postman** or your WebSocket frontend to test these payloads.

---

## 🧰 Troubleshooting

### ❌ Emulator Freezes or Doesn't Load

* Force stop all apps in emulator (including Expo Go)
* Reopen Expo Go manually
* Paste `exp://` link directly into the emulator browser
* Confirm you're using **Expo SDK 53**

### ❌ WebSocket or API Connection Issues

* Ensure Django server is running
* Confirm ngrok tunnel is active
* Check if `api.ts` is using correct `HOST` and port
* Check terminal logs for WebSocket output
* Use loguru.logger to understand the function call stack

### ❌ Frontend terminals Freeze after clicking shift+a annd selecting emulator

* Its fine,it happened with me
* Just continue as it is
* If Ctrl+C isnt working just terminate the shell (or Ctrl+F4)
* If clicking R doesn't reload app,its fine.Close all background apps in emulator including Expo and type the `exp://` url
* Check terminal logs for WebSocket output
---

## 🆘 Need Help?

* Review `consumers.py` and `routing.py` to debug WebSocket issues
* Double-check Expo version compatibility with SDK 53
* For Expo-specific help: [Expo Documentation](https://docs.expo.dev)
* Test using:

  ```bash
  ws://localhost:8000/ws/rider/<rider_id>
  ws://localhost:8000/ws/driver/<driver_id>
  ```

---

🧡 Made with passion by the **eMotion Team**
Let's make ride sharing smarter and smoother!

---