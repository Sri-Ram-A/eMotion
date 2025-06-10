import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { backendUrl } from './config';

function Route({ onDataReceived }) {
  const [startField, setStartField] = useState("");
  const [destField,  setDestField]  = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${backendUrl}/maps/route?start=${encodeURIComponent(startField)}&dest=${encodeURIComponent(destField)}`,
        {
            headers: { 'ngrok-skip-browser-warning': '69420' }
        }
      );
      const data = await res.json();
      onDataReceived(data[0]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div style={{ position: 'absolute', top: 80, left: 50, color: 'red' }}>
          {error}
        </div>
      )}
      <div style={{ position: 'absolute', top: 20, left: 50, zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TextField
              label="Start"
              variant="filled"
              size="small"
              value={startField}
              onChange={e => setStartField(e.target.value)}
            />
            <TextField
              label="Destination"
              variant="filled"
              size="small"
              value={destField}
              onChange={e => setDestField(e.target.value)}
            />
          </div>
          <Button
            variant="contained"
            size="small"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Go'}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Route;