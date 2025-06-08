import { Platform } from 'react-native';
//Use if you havent tunneled/hosted your backend
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const BASE_API_URL = `http://${HOST}:8000/api/rider/`;
export const SOCKET = `ws://${HOST}:8000/ws/rider/`;

//Use this if you have tunneled or hosted backend
//const HOST = "cub-true-shiner.ngrok-free.app"
// https://cub-true-shiner.ngrok-free.app/rider
// wss://cub-true-shiner.ngrok-free.app/ws/rider #this wss link you cannot put in browser..only postman
//export const BASE_API_URL = `https://${HOST}/api/rider/`;
//export const SOCKET = `wss://${HOST}/ws/rider/`;

