import React, { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import {Link, useParams} from 'react-router-dom'
import axios from "axios";
import "./BookingsPage.css";
import BookingPage from "../BookingPage/BookingPage";
import BookingPeriod from "../../components/BookingPeriod";

const BookingsPage = () => {
  const {action} = useParams();
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios
      .get("bookings")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((err, response) => {
        console.log(response);
        throw err;
      });
  }, []);

  return (
  <>
    {action===undefined &&(
    <div className="bookingsWhole">
      <div className="bookingsList">
        <p className="heading"> List of booked places</p>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link to={"/account/bookings/"+ booking._id} className="bookingsDiv" key={booking._id}>
              <div className="bookingsPhotoDiv">
                {booking.place.photos.length > 0 && (
                  <img
                    className="bookingsPhoto"
                    src={
                      axios.defaults.baseURL +
                      "/uploads/" +
                      booking.place.photos[0]
                    }
                  />
                )}
              </div>
              <div className="bookingsExceptPhoto">
                <p className="bookingsTitle">{booking.place.title}</p>
                <p className="bookingsAddress">{booking.place.address}</p>
                <BookingPeriod checkIn={booking.checkIn} checkOut={booking.checkOut}/>
                <div className="logs">
                  <p className="bookingsPeriod">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>

                    {differenceInCalendarDays(
                      new Date(booking.checkOut),
                      new Date(booking.checkIn)
                    )}{" "}
                    <span className="font-light text-sm">nights </span>
                  </p>
                  <div className="border border-gray-500 h-6"></div>
                  <div className="bookingsPrice">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>

                    <p>Total Cost: </p>
                    <span className="text-lg font-normal">
                      {booking.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>{" "}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>)}
    {
    action!==undefined &&(
      <BookingPage />
    )}
  </>
    
  );
};

export default BookingsPage;

