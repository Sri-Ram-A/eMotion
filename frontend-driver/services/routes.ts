import * as api from './api';

export const handleSubmit = (ws: WebSocket) => {
  ws.onopen = () => { // connection opened
      ws.send(JSON.stringify("Driver Connected")); 
  };     
}
