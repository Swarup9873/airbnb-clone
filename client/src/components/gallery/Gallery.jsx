import React, { useState } from 'react'
import axios from 'axios'
import './gallery.css'

const Gallery = ({place}) => {

  const [showAllPhotos, setShowAllPhotos] = useState(false);
  
  if(showAllPhotos){
    window.scrollTo({
      top: 0,
      behavior: 'auto', // You can use 'auto' instead of 'smooth' for an instant jump
    });
    return (
    <div className='showPhotosPage'>
      <p className='photosPageTitle'>Photos from {place.title}</p>
      
      <div className='showPhotosList'>
        <div>
          <button className='closePhotos' onClick={()=>setShowAllPhotos(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close Photos
          </button>
        </div>
        {place?.photos?.length >0 && place.photos.map(photo =>(
          <div className='showPhotoImg' key={photo}>
            <img className='' src={axios.defaults.baseURL+'/uploads/'+photo}/>
          </div>
        ))}
      </div>

    </div>)
  }
    
  return (
    <div className='completePhotoGrid'>
          <div className={place.photos.length>=5?"roomImgDiv1":"roomImgDiv2"}>
            <div>
              {place.photos?.[0] && (
                <img onClick={()=>{setShowAllPhotos(true)}} className='cursor-pointer roomPhoto' src={axios.defaults.baseURL+'/uploads/'+place.photos[0]}/>
              )}
            </div>
            {place.photos.length>=5 &&
            <div className='overflow-hidden hidden sm-max:grid'>
              {place.photos?.[3]  && place.photos.length>=5 && (
                <img onClick={()=>{setShowAllPhotos(true)}} className='cursor-pointer addsnlPhotos relative -top-1' src={axios.defaults.baseURL+'/uploads/'+place.photos[3]}/>
              )}
              
              {place.photos?.[4]  && place.photos.length>=5 && (
                <img onClick={()=>{setShowAllPhotos(true)}} className='cursor-pointer addsnlPhotos relative top-1' src={axios.defaults.baseURL+'/uploads/'+place.photos[4]}/>
              )}
            </div>
            }
            <div className='overflow-hidden hidden sm-max:grid'>
              {place.photos?.[1] && (
                <img onClick={()=>{setShowAllPhotos(true)}} className='cursor-pointer addsnlPhotos relative -top-1' src={axios.defaults.baseURL+'/uploads/'+place.photos[1]}/>
              )}
              
              {place.photos?.[2]  && (
                <img onClick={()=>{setShowAllPhotos(true)}} className='cursor-pointer addsnlPhotos relative top-1' src={axios.defaults.baseURL+'/uploads/'+place.photos[2]}/>
              )}
            </div>
          </div>
          <button className='showAll' onClick={()=>{setShowAllPhotos(true)}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Show all photos</button>
        </div>
  )
}

export default Gallery