import React from 'react';
import Autocomplete from 'react-google-autocomplete';

function LocationSearch(props) {

    const onPlaceSelected = (place) => {
        if(typeof place.geometry !== 'undefined'){
        const latValue = place.geometry.location.lat();
        const lngValue = place.geometry.location.lng();
        props.setLocation({ lat: latValue, lng: lngValue })
        props.setError(false)
        }else{
            props.setError(true)
        }
    };

   return ( <Autocomplete
        style={{
            width: '60%',
            height: '40px',
            textAlign: 'center',
            borderRadius: '10px',
            borderColor: 'black',
            marginTop:'30px',
            placeholder:'Test'
        }}
        data-testid='autocomplete-search'
        onPlaceSelected={(place) => onPlaceSelected(place)}
        types={['address']}
    />)
}

export default LocationSearch