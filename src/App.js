import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import L from 'leaflet';
import icon from './images/icon-location.svg';

const initData = {
  ip: '-',
  coords: [51.505, -0.09],
  location: '-',
  timezone: '-',
  isp: '-',
  popup: 'Enter IP Address'
}

const markerIcon = new L.Icon({
  iconUrl: icon,
  iconAnchor: new L.Point(20, 40),
  iconSize: new L.Point(35, 45),
  popupAnchor: new L.Point(-2, -40),
});

const App = () => {
  const [data, setData] = useState(initData);
  const [val, setVal] = useState('');
  const [error, setError] = useState('');

  const handleOnChange = (e) => {
    const string = e.target.value;
    setVal(string.match(/[\d.]{1,}/g) || '');
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const url = `https://geo.ipify.org/api/v1?apiKey=at_X2e3Vz5PxMJ42uummDy40XoAMnlGZ&ipAddress=${val}`;
    fetch(url)
      .then(json => json.json())
      .then((data) => {
        setError('');
        if(data.messages !== undefined) {
          setError(data.messages);
        } else {
          const newData = {
            ip: data.ip, 
            coords: [data.location.lat, data.location.lng], 
            location: data.location.city + (data.location.postalCode ? ", " + data.location.postalCode : '') || '-',
            timezone: data.location.timezone ? 'UTC ' + data.location.timezone : '-', 
            isp: data.isp, 
            popup: data.ip + '\n' + data.location.city
          }
          setData(newData);
          setVal('');
        }
      });
  }

  return (
    <>
      <header>
        <div className="wrapper">
          <h1>IP Address Tracker</h1>
          <form className="shadow" onSubmit={handleOnSubmit}>
            {error ? <div className="error shake">{error}</div> : ''}
            <input type="text" name="address" id="address" value={val} onChange={handleOnChange} placeholder="Search for any IP address or domain" className={error ? 'error' : ''}/>
            <input type="submit" value=""/>
          </form>
          <section className="result shadow">
            <div className="wrapper">
              <div className="result__block">
                <p className="result__name">ip address</p>
                <p className="result__value">{data.ip}</p>
              </div>
              <div className="result__block">
                <p className="result__name">location</p>
                <p className="result__value">{data.location}</p>
              </div>
              <div className="result__block">
                <p className="result__name">timezone</p>
                <p className="result__value">{data.timezone}</p>
              </div>
              <div className="result__block">
                <p className="result__name">isp</p>
                <p className="result__value">{data.isp}</p>
              </div>
            </div>
          </section>
        </div>
      </header>
      <MapContainer center={data.coords} zoom={15} zoomControl={false} scrollWheelZoom={true}>
        <Test data={data}/>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.ip !== '-' ? 
          <Marker position={data.coords} icon={markerIcon}>
            <Popup>
              {data.popup}
            </Popup>
          </Marker>
          : ''
        }
        
      </MapContainer>
    </>
  )
}

const Test = ({data}) => {
  const map = useMap();
  map.flyTo(data.coords, 14);
  return null;
}

export default App;