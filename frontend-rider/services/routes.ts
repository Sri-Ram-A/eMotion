import * as api from './api';

interface RiderMessage {
    source: string;
    destination: string;
}
export const handleSubmit = (ws: WebSocket, message: RiderMessage) => {
  ws.onopen = () => { // connection opened
      ws.send(JSON.stringify(message)); 
  };     
}
