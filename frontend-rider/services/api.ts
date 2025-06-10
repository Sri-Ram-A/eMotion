import { Platform } from 'react-native';

const useTunnel = false; // ✅ Set to `true` if using ngrok or hosted backend

let HOST: string;
let BASE_API_URL: string;
let SOCKET: string;

if (useTunnel) {
  // ✅ Hosted/Tunneled Configuration
  HOST = "cub-true-shiner.ngrok-free.app";
  BASE_API_URL = `https://${HOST}/api/rider/`;
  SOCKET = `wss://${HOST}/ws/rider/`;
} else {
  // ✅ Local Development Configuration
  HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  BASE_API_URL = `http://${HOST}:8000/api/rider/`;
  SOCKET = `ws://${HOST}:8000/ws/rider/`;
}

export { BASE_API_URL, SOCKET };
