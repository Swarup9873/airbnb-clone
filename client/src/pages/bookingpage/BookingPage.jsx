import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AddressLink from '../../components/address/AddressLink';
import axios from 'axios'
import './bookingPage.css'
import Gallery from '../../components/gallery/Gallery';
import BookingPeriod from '../../components/BookingPeriod';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

const BookingPage = () => {
  
    const {action} =useParams();
    const [booking, setBooking] =useState(null);
    
    useEffect(()=>{
        if(action){
            axios.get('/bookings')
            .then(({data})=>{
                const dataFound = data.find(({_id})=>_id===action);
                setBooking(dataFound);
            })
            .catch(()=>{
                throw err;
            })
        }
    },[])

    if(!booking)
        return 'Loading...';

  return (
    <div className='bookingWhole'>
        <div className='bookingPage'>
            <div className="flex justify-center">
                <p className='bookingHead'> Reservation Details </p>
            </div>
            <p className='bookingTitle'>{booking.place.title}</p>
            <AddressLink address={booking.place.address}/>
            <div className="bookingInfo">
                <div className='flex flex-col justify-between py-1'>
                    <p className="bookingInfoHead">Your booking information:</p>
                    <div className='flex items-center gap-4'>
                        <p className="text-2xl flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>

                            {differenceInCalendarDays(
                            new Date(booking.checkOut),
                            new Date(booking.checkIn)
                            )}{" "}
                            <span className="font-light text-sm">nights </span>
                        </p>
                        <BookingPeriod checkIn={booking.checkIn} checkOut={booking.checkOut}/>
                    </div>
                </div>
                <div className="bookingTotPrice">
                    <p className='font-bold text-xs'>Total Price:</p>
                    <p className='text-2xl'>{booking.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}/-</p>
                </div>
            </div>
            <Gallery place={booking.place}/>
        </div>
    </div>
  )
}

export default BookingPage