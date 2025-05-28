import { Platform } from 'react-native';
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const BASE_API_URL = `http://${HOST}:8000/api/driver/`;
export const SOCKET = `ws://${HOST}:8000/ws/driver/`;

