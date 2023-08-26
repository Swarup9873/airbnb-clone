import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PlaceForm from '../../components/placeForm/PlaceForm';

const EditPlace = ({id}) => {

  return (
    <div>
      <PlaceForm id={id} />
    </div>
  )
}

export default EditPlace