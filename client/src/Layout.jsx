import React from 'react'
import Header from './components/header/Header'
import { Outlet } from 'react-router-dom'
import "./layout.css"
const Layout = ({openLoginModal, closeModal}) => {
  return (
    <>
      <div className='whole'>
        <Header/>
        <div className='exceptHeader'>
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default Layout