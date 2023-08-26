import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import "./RoomsPage.css"
import BookingWidget from '../BookingWidget/BookingWidget'
import Gallery from '../../components/gallery/Gallery'
import AddressLink from '../../components/address/AddressLink'

const RoomsPage = () => {
  const [place, setPlace] = useState();
  const {id} = useParams();
  const [showPhotos,setShowPhotos] =useState(false);
  
  useEffect(()=>{
    if(!id)
      return;
    axios.get(`/places/${id}`)
    .then(({data})=>{
      if(data)
        setPlace(data);
    })
    .catch((err)=>{
      console.log("axios-error");
    });
  },[]);

  if(!place)
    return "No such place exists";

  return (
    <div className='roomPage'>
      <div className='roomBody'>
        {
        !showPhotos &&(
        <div className='roomHead'>
          <p className='roomTitle'>{place.title}</p>
          <div className='roomHeadDiv'>
            <AddressLink address={place.address}/>
          </div>
        </div>)
        }
        <Gallery place={place}/>
        {
        !showPhotos &&(
        <>
        <div className='border border-gray-300'/>
        <div className='belowPhoto'>
          <div className='left'>          
            <div className="roomDesc">
              <p className='roomDescTitle'>Description</p>
              <p className='roomDescText'>&nbsp;&nbsp;{place.description}</p>
            </div>
            
            <div className='border border-gray-300'/>

            <div className='check'>
              <p className="checkHead">Check-in Time:</p>{place.checkIn} <br/>
              <p className="checkHead">Check-out Time:</p>{place.checkOut} <br/>
              <p className="checkHead">Maximum Number of Guests:</p>{place.maxGuest} <br/>
            </div>
          </div>
          <div className='right'>
            <BookingWidget place={place}/>
          </div>
        </div>
        </>)}
      </div>  
      
      <div className="roomInfo">
        <p className='roomInfoTitle'>Extra Info</p>
        <p className='roomInfoText text-sm'>{place.extraInfo}</p>
      </div>
    </div>
  )
}

export default RoomsPage