import React from "react"
import "./App.css";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { LocationMarkerIcon } from "@heroicons/react/solid";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function App() {
  
  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [landmark, setLandmark] = useState(null);
  const [desc, setDesc] = useState(null);
  const [contact, setContact] = useState(null);
  const [price, setPrice] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 22.9734,
    longitude: 78.6569,
    zoom: 8,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("https://spotolet-server.herokuapp.com/api/pins");
        //console.log(res.data);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: long,
    });
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    //console.log(e);
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleDeletePin = async (id) => {
    setPins(pins.filter((pin) => pin._id !== id));
    try {
      await axios.delete("https://spotolet-server.herokuapp.com/api/pins/" + id);
    } catch (error) {
      console.log(error);
    }
    setCurrentPlaceId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      landmark,
      description: desc,
      contact,
      price,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("https://spotolet-server.herokuapp.com/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      mapStyle="mapbox://styles/theiconik/ckrqh4sz84rnc18rufnbgx6m0"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={currentUser && handleAddClick}
    >
      {pins.map((p) => {
        return (
          <React.Fragment key={p._id}>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <LocationMarkerIcon
                className="w-200 h-200 text-purple-500"
                style={{
                  width: viewport.zoom * 7,
                  height: viewport.zoom * 7,
                  cursor: "pointer",
                  color:
                    p.username === currentUser ? "tomato" : "mediumslateblue",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card w-full bg-white px-4 py-4">
                  <label>Landmark</label>
                  <h4 className="place">{p.landmark}</h4>
                  <label>Description</label>
                  <p className="desc">{p.description}</p>
                  <label>Contact</label>
                  <p>{p.contact}</p>
                  <label>Price</label>
                  <p>{p.price}</p>
                  <label>Information</label>
                  <span className="username">
                    Created by <i>{p.username}</i>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                  {p.username === currentUser && (
                    <button
                      className="deleteButton"
                      onClick={() => handleDeletePin(p._id)}
                    >
                      Delete Pin
                    </button>
                  )}
                </div>
              </Popup>
            )}
          </React.Fragment>
        );
      })}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form action="" onSubmit={handleSubmit}>
              <label htmlFor="">Landmark</label>
              <input
                type="text"
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Enter Landmark"
              />
              <label htmlFor="">Description</label>
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Details for rent room/home"
              ></textarea>
              <label htmlFor="">Contact</label>
              <input
                onChange={(e) => setContact(e.target.value)}
                type="text"
                placeholder="Phone Number or Email"
              />
              <label htmlFor="">Price</label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                type="text"
                placeholder="Price"
              />
              <button className="submitButton" type="submit">
                Add Rent Location
              </button>
            </form>
          </div>
        </Popup>
      )}
      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>Logout</button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
          <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage = {myStorage} setCurrentUser={setCurrentUser} />}
    </ReactMapGL>
  );
}

export default App;
