import * as React from 'react';
import { useState } from 'react';
import ReactMapGL from 'react-map-gl';

function App() {

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  return (
    <div className="App">
     <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/saket2000/ckogj12k43r0r17ol04ixk9ye"
    />
    </div>
  );
}

export default App;