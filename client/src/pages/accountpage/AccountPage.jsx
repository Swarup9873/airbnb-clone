import React, { useContext } from 'react'
import "./AccountPage.css"
import { UserContext } from '../../contexts/UserContext'
import { Navigate, Link, useParams } from 'react-router-dom';
import PlacesPage from '../placespage/PlacesPage';
import BookingsPage from '../bookingspage/BookingsPage';

const AccountPage = () => {
    const {user,userReady} =useContext(UserContext);
    const {subpage}= useParams();

    if(!userReady){
        return 'Loading...';
    }
    if(userReady && !user){
        return <Navigate to={'/login'}/>
    }


    function linkClass(type=null){
        if(type===subpage)
            return "clicked";
        return "";
    }

    return (
    <>
        <div className='content accountHead'>
            <div className='accountHeadHead'>
                
                <h1 className='account'>Account</h1>
                <div className='firstAccountLine'>
                    <span className='name'>
                        {user.name},{" "}
                    </span>    
                    <span className='email'>
                        {user.email} ·{" "}
                    </span>
                    <Link to="/account/profile" className="profileLink">
                        Go to profile</Link>
                </div>
            </div>
            <nav className='optionsList'>
                <Link className={"option "+linkClass('bookings')} to="/account/bookings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    My bookings
                </Link>
                <Link className={'option '+linkClass('places')} to="/account/places"> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    My accomodations
                </Link>
            </nav>
        </div>
        {
        subpage==='bookings' && (
            <BookingsPage />
        )}
        {
        subpage==='places' &&(
            
        <div className="content">
            <PlacesPage />
        </div>
        )
        }
    </>
    )
}

export default AccountPage