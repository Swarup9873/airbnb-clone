import React, { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from 'date-fns'
import './BookingWidget.css'
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const BookingWidget = ({ place }) => {

  const currentTime = new Date();
  const checkInDefault = new Date(currentTime);
  const checkOutDefault = new Date(currentTime);
  checkInDefault.setDate(currentTime.getDate()+1);
  checkOutDefault.setDate(currentTime.getDate()+5);
  
  const [checkIn, setCheckIn] = useState(checkInDefault.toLocaleString('fr-CA').slice(0, 10));
  const [checkOut, setCheckOut] = useState(checkOutDefault.toLocaleString('fr-CA').slice(0, 10));
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [redirect, setRedirect] = useState('');
  const numberOfNights= differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  const priceOpt= { style: 'currency', currency: 'INR' };

  const {user,userReady} =useContext(UserContext);
  const navigate = useNavigate();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  
  
  function handleReserve(){
    
    if(!user && userReady){
      setRedirectToLogin(true);
    }
    else{
      const price= (numberOfNights*place.price)+(0.14*numberOfNights*place.price);
      const data ={
        place:place._id, checkIn, checkOut, numberOfGuests, price 
      }
      axios.post('/booking',data)
      .then(({data})=>{
        if(data){
          const booking_id =data._id;
          setRedirect(`/account/bookings/${booking_id}`);
        }
      })
      .catch((err)=>{
        throw err;
      })
    }
  }

  useEffect(()=>{  
    if(redirect){
      navigate(redirect)
    }
  },[redirect])

  useEffect(() => {
    if (redirectToLogin) {
      navigate("/login"); 
    }
  }, [redirectToLogin, navigate]);

  return (
    <div>
      <p className="roomPrice">
        <span className="text-2xl font-semibold">₹{place.price.toLocaleString()}</span> night
      </p>
      <div className="checkGrid">
        <div className="dateCheck">
          <label>CHECK-IN:</label>
          <input
            type="date"
            value={checkIn}
            onChange={(ev) => setCheckIn(ev.target.value)}
          />
        </div>
        <div className="h-8 w-px bg-gray-400"></div>
        <div className="dateCheck">
          <label>CHECK-OUT:</label>
          <input
            type="date"
            value={checkOut}
            onChange={(ev) => setCheckOut(ev.target.value)}
          />
        </div>
      </div>
      <div className="noOfGuest">
        <label>NUMBER OF GUESTS:</label>
        <input id="guestInput" min="1" type="number" 
          value={numberOfGuests}
          onChange={(ev) => setNumberOfGuests(ev.target.value)}
        />
      </div>
      <button className="reserve" onClick={handleReserve}>Reserve</button>
      <p className="mt-2 text-center font-light"> You won't be charged yet</p>
      <div className="costSection">
        <div className="calcCost"><p className="underl">₹{(place.price).toLocaleString()} x {numberOfNights} nights</p>{(numberOfNights*place.price).toLocaleString('en-IN', priceOpt)}</div>
        <div className="calcCost"><p className="underl">Airbnb service fee</p>{(0.14*numberOfNights*place.price).toLocaleString('en-IN', priceOpt)}</div>
      </div>
      <div className="border"/>
      <div>
        <p className="font-semibold pt-4 flex justify-between">Total before taxes <span>{((numberOfNights*place.price)+(0.14*numberOfNights*place.price)).toLocaleString('en-IN', priceOpt)}</span></p>
      </div>
    </div>
  );
};

export default BookingWidget;
