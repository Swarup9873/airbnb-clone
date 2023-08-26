import React, { useContext, useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import './IndexPage.css'
import axios from 'axios'
import { UserContext } from "../../contexts/UserContext";

const IndexPage = () => {
  const [places, setPlaces]= useState([]);
  const {searchString}= useContext(UserContext);
  useEffect(()=>{
    axios.post('/placeSearch',{searchString})
    .then(({data})=>{
      if(data)
        setPlaces(data);
      else
        return "No data";
    })
    .catch((err)=>{
      console.log(err);
    })
  },[searchString])

  return (
    <div className="indexPage">
      <div className="indexPlaces">
      {places.length>0 && places.map(place=>(
        <Link to={"/rooms/"+place._id} className="indexPlace" key={place._id}>
          <div className="indexPlacePhotoDiv">
          {place.photos?.[0] &&(
            <img className="indexPlacePhoto" src={axios.defaults.baseURL+'/uploads/'+place.photos[0]} />
          )}
          </div>
          
          <div className="indexPlaceAddress">
            {place.address}
          </div>

          <div className="indexPlaceTitle">
            {place.title}
          </div>
          
          <div className="indexPlacePrice">
            <span className="font-semibold">₹{place.price}</span> per night
          </div> 
        </Link>
      ))}
      </div>
    </div>
  );
};

export default IndexPage;
