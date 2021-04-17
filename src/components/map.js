import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom'
import BarDataService from "../services/bar.service";
import Geocode from "react-geocode";
import '../styles/map.css'
import { getDistance } from 'geolib';
import CircularProgress from '@material-ui/core/CircularProgress';

var options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0
};


function Map(props) {

    const [bars, setBars] = useState([])
    let location = props.location
    const [posWindow, setPosWindow] = useState({ lat: 0, lng: 0 });
    const [ids, setIds] = useState({});
    const setLocation = props.setLocation
    const error = props.error
    const setError = props.setError
    const history = useHistory()
    const [loading, setLoading] = useState(false)

    const setStartLoc = useCallback(() => {
        return new Promise(function (resolve, reject) {    
            if (navigator && navigator.geolocation) {
                return navigator.geolocation.getCurrentPosition(
                    pos => {
                        setError(false)
                        return resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    },
                    err => { 
                        setLoading(false)
                    }
                ,options);
            }
            return resolve({ lat: 0, lng: 0 });
        });
    }, [setError])

    useEffect(() => {
        setLoading(true)
        setStartLoc().then(startLoc => {
            setLoading(false)
            setLocation(startLoc)
        }).catch(err => console.log(err))
    }, [setLocation, setStartLoc]);

    useEffect(() => {
        BarDataService.getAllWithCapacity().then(res => {
            setBars(res.data);
        })
            .catch(e => {
                console.log("El error es ", e);
                history.push("/pageNotFound")
            });
    }, [history])


    const [arr, setArr] = useState([])

    useEffect(() => {
        Geocode.setApiKey(process.env.REACT_APP_API_KEY);
        Geocode.setLanguage("en");
        Geocode.setRegion("es");
        Geocode.setLocationType("ROOFTOP");

        Promise.all(bars)
            .then((resp) => {
                resp.forEach((bar) => {
                    Geocode.fromAddress(bar.location).then(
                        (response) => {
                            const { lat, lng } = response.results[0].geometry.location;
                            const list = ({ lat: parseFloat(lat), lng: parseFloat(lng), bar: bar })
                            setArr(prevArray => [...prevArray, list])
                            setError(false)
                        },
                        (err) => {
                            history.push("/pageNotFound")
                            console.log(err);
                        })
                })
            })
    }, [bars, setError, history])


    const obtainDistance = (lat, lng) => {
        return getDistance(
            { latitude: location.lat, longitude: location.lng },
            { latitude: lat, longitude: lng }
        );
    }

    return (
        <div>
            <div className="map">
                {loading ? <div>
                    <CircularProgress />
                    <p>Cargando mapa...</p>
                    </div>
                : <div></div>}
                {location && error===false && 
                    <GoogleMap
                        mapContainerClassName='contain'
                        center={location}
                        zoom={10}>
                        {arr.map(function (v, index) {
                            return <div data-testid={'marker-' + index} key={'div-' + index}>
                                {typeof v.lat !== "undefined" && obtainDistance(v.lat, v.lng)<200000 && (
                                    <Marker key={'mark-' + index}
                                        position={{ lat: v.lat, lng: v.lng }}
                                        onClick={() => {
                                            setPosWindow({
                                                ...posWindow, lat: v.lat + 0.0005,
                                                lng: v.lng
                                            })
                                            setIds({ ...ids, id: index })
                                        }}
                                    >
                                        <div >
                                            {ids.id === index &&
                                                <InfoWindow key={'info-' + index}
                                                    onCloseClick={() => {
                                                        setIds({ id: null })
                                                    }}
                                                    position={posWindow}>
                                                    <div >
                                                        <Link key={'link-' + index} to={'/bares/'+v.bar.id}>
                                                            <h3>{v.bar.name}</h3>
                                                        </Link>
                                                        <p>{v.bar.location}</p>
                                                    </div>
                                                </InfoWindow>}
                                        </div>
                                    </Marker>
                                )}
                            </div>
                        })}
                    </GoogleMap>
                    }
            </div>
        </div>
    )
}

export default Map;