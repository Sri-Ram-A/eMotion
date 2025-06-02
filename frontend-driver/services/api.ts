// import { Platform } from 'react-native';
//Use if you havent tunneled/hosted your backend
// const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
// export const BASE_API_URL = `http://${HOST}:8000/api/driver/`;
// export const SOCKET = `ws://${HOST}:8000/ws/driver/`;

//Use this if you have tunneled or hosted backend
const HOST = "cub-true-shiner.ngrok-free.app"
// https://cub-true-shiner.ngrok-free.app/driver
// wss://cub-true-shiner.ngrok-free.app/ws/driver #this wss link you cannot put in browser..only postman
export const BASE_API_URL = `https://${HOST}/api/driver/`;
export const SOCKET = `wss://${HOST}/ws/driver/`;