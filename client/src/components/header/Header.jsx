import React, { useContext, useState } from 'react'
import "./Header.css"
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'

const Header = () => {
  const {user, setSearchString, searchString} = useContext(UserContext);
  const location = useLocation();
  var currentPath = location.pathname;
  
  const [search, setSearch]= useState("");

  const InitialIcon = ({ initials }) => {
    
    return (
      <div className='namedLogo'>
        <p className="namedLogoText">{initials}</p>
      </div>
    );
  };

  function handleFormSubmit(ev){
    ev.preventDefault();
    setSearchString(search);
  }

  return (
  <>
    <div className="head">
      <Link to={'/'} className="logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={(!currentPath.startsWith('/rooms'))?"logoImg":"prettyImg"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
          />
        </svg>
        <span className={(!currentPath.startsWith('/rooms'))?"logotext":"invis"}> airbnb-clone</span>
      </Link>

      <div className={(!currentPath.startsWith('/account'))?"searchBlock":"invis"}>
        <div className="searchComp"><p className="text">Anywhere</p></div>

        <div className="border-l  border-gray-300"></div>

        <div className="searchComp"><p className="text">Any Week</p></div>

        <div className="border-l  border-gray-300"></div>

          <form className='searchHeaderForm' onSubmit={(ev)=>handleFormSubmit(ev)}>
            <input id="searchHeader" type="text" placeholder='Search' value={search} onChange={(ev) => setSearch(ev.target.value)}></input>
            <button className="searchButton" type='submit'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </form>

        
      </div>
      <div className='flex'>
        <div className="catchphrase"><p>Grab your home</p></div>

        <Link to={user?"/account":"/login"} className="profile">
          <div className="threeBars">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          {!user &&
          <div className="profileLogo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>}
          {!!user && (
            <InitialIcon initials={user.name.charAt(0).toUpperCase()}/>
          )}
        </Link>
      </div>
    </div>
  </>
  )
}

export default Header
