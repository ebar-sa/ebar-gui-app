import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom'
import BarDataService from "../services/bar.service";
import '../styles/map.css'
import CircularProgress from '@material-ui/core/CircularProgress';

var options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0
};


function Map(props) {

    const [bars, setBars] = useState([])
    let location = props.location
    const [posWindow, setPosWindow] = useState();
    const [ids, setIds] = useState({});
    const setLocation = props.setLocation
    const error = props.error
    const setError = props.setError
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const zoom = 15

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
        let isMounted = true;
        setLoading(true)
        setStartLoc().then(startLoc => {
            if (isMounted){
            setLoading(false)
            setLocation(startLoc)
            }
        }).catch(err => console.log(err))
        return () => { isMounted = false };
    }, [setLocation, setStartLoc]);

    useEffect(() => {
        if(location){
            BarDataService.getBarsMap(location).then(res => {
                setBars(res.data);
            })
            .catch(e => {
                console.log("El error es ", e);
                history.push("/pageNotFound")
            });
        }
    }, [history, location])



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
                        zoom={zoom}>
                        {bars.map(function (v, index) {
                            return <div data-testid={'marker-' + index} key={'div-' + index}>
                                    <Marker key={'mark-' + index}
                                        position={{ lat: v.coord.lat, lng: v.coord.lng }}
                                        onClick={() => {
                                            setPosWindow({
                                                ...posWindow, lat: v.coord.lat + 0.0005,
                                                lng: v.coord.lng
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
                                                        <Link key={'link-' + index} to={'/bares/'+v.id}>
                                                            <h3>{v.name}</h3>
                                                        </Link>
                                                        <p>{v.location}</p>
                                                        <p>Mesas disponibles: {v.capacity}</p>
                                                    </div>
                                                </InfoWindow>}
                                        </div>
                                    </Marker>
                                )
                            </div>
                        })}
                    </GoogleMap>
                    
                    }
            </div>
        </div>
    )
}

export default Map;