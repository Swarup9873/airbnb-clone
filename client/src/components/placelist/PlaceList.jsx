import React, { useEffect, useState } from 'react'
import './placeList.css'
import axios from 'axios'
import { Link } from 'react-router-dom';

const PlaceList = () => {
  const [places, setPlaces] = useState([]);
  useEffect(()=>{
    axios
    .get('/user-places')
    .then(({data:placesData})=>{
      setPlaces(placesData);
    })
  },[])

  return (
    <div className='placeList'>
      <p className="heading"> List of added places</p> 
      {places.length>0 && places.map(place=>(
        <div className="placeDiv" key={place._id}>
          <div className="placePhotoDiv">
            {place.photos.length>0 &&(
              <img className="placePhoto" src={axios.defaults.baseURL+'/uploads/'+place.photos[0]} />
            )}
          </div>
          <div className="exceptPhoto">  
            <Link to={"/account/places/"+place._id} className='editButton'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 20" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
              Edit</Link>
            <p className="placeTitle">{place.title}</p>
            <p className="placeAddress">{place.address}</p>
            <p className="placePrice">₹{place.price}/- per night</p>
          </div>
          
        </div>
      ))}
    </div>
  )
}

export default PlaceList