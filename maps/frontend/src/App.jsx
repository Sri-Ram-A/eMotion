import React, { useState } from 'react';
import Map from './Map.jsx';
import Route from './Route.jsx';


const App = () => {
  const [ markers, setMarkers ] = useState([]);

  function handleMarkersChange (data) { setMarkers(data); }

  return (
    <>
      <Map markers={ markers }/>
      <Route onDataReceived={ handleMarkersChange }/>
    </>
  );
};

export default App;
