import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Perks from "../../components/perks/perks";

const PlaceForm = ({ id }) => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("14:00");
  const [checkOut, setCheckOut] = useState("13:00");
  const [maxGuest, setMaxGuest] = useState(1);
  const [price, setPrice] = useState(500);
  const navigate = useNavigate();
  const [foundPlace, setFoundPlace] = useState(false);
  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`)
    .then((response) => {
      setFoundPlace(true);
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setDescription(data.description);
      setAddedPhotos(data.photos);
      setExtraInfo(data.extraInfo);
      setPerks(data.perks);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuest(data.maxGuest);
      setPrice(data.price);
    })
    .catch((err)=>{
      throw err;
    });
  }, [id]);

  const handleMaxGuestChange = (event) => {
    const newValue = Math.max(1, event.target.value);
    setMaxGuest(newValue);
  };

  function addPhotoByLink(ev) {
    ev.preventDefault();
    axios.post("/upload-by-link", { link: photoLink }).then(({ data }) => {
      const filename = data;
      setAddedPhotos((prev) => {
        return [...prev, filename];
      });
    });
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data: filenames }) => {
        setAddedPhotos((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  function removePhoto(ev,link){
    ev.preventDefault();
    setAddedPhotos([...addedPhotos.filter(photo=>photo!==link)]);
  }

  function starPhoto(ev,link){
    ev.preventDefault();
    setAddedPhotos([link,...addedPhotos.filter(photo=>photo!==link)])
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
      price
    };

    if(id){
      //update_placeData
      axios.put('/places',{
        id, ...placeData
      })
      .then((response)=>{
        console.log(response);
        navigate("/account/places");
      });
    }
    else{
      //new_placeData
      
      axios.post("/places", placeData).then(( ) => {
        navigate("/account/places");
      });
    }
  }

  return (
    <>
    { (!id || foundPlace) &&
      (<div className="new">
        <p className="heading">Fill the form -</p>
        <div className="newPlaceForm">
          <form onSubmit={handleFormSubmit}>
            <p className="inputTitle">Title</p>
            <p className="inputDesc">
              Give an attractive and catchy name for your place
            </p>
            <input
              className="inputs"
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title"
            />

            <p className="inputTitle">Address</p>
            <p className="inputDesc">Enter complete address to this place</p>
            <input
              className="inputs"
              type="text"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              placeholder="address"
            />

            <p className="inputTitle">Photos</p>
            <p className="inputDesc">Add related photos to present your place(mininmum: 3)</p>
            <div className="addPhoto">
              <input
                className="inputs"
                type="text"
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                placeholder="Add link to a jpg file"
              />
              <button className="addPhotoButton" onClick={addPhotoByLink}>
                Add&nbsp;photo
              </button>
            </div>
            <div className="photos">
              {addedPhotos.length > 0 &&
              addedPhotos.map((link) => (
                <div className="photoDiv" key={link}>
                  <img
                    className="photo"
                    src={axios.defaults.baseURL + "/uploads/" + link}
                  />
                  <button className="delete" onClick={(ev)=>{removePhoto(ev,link)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                  
                  <button className="star" onClick={(ev)=>{starPhoto(ev,link)}}>
                  {link===addedPhotos[0] &&(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  )}
                  {link!==addedPhotos[0] && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  )}
                  </button>
                </div>
              ))}
              <label className="uploadPhotoButton">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                  />
                </svg>
                <p className="text-center">Upload from device</p>
              </label>
            </div>

            <p className="inputTitle">Description</p>
            <p className="inputDesc">Describe the place briefly</p>
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />

            {<Perks selected={perks} setSelected={setPerks} />}

            <p className="inputTitle">Additional Info</p>
            <p className="inputDesc">House rules, etc</p>
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />

            <p className="inputTitle">Check-in & out times And other details</p>
            <p className="inputDesc">
              Advisable to leave some time between guests
            </p>
            <div className="check">
              <div className="">
                <p className="mt-2 -mb-1">Check-in time</p>
                <input
                  type="text"
                  className=" "
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  placeholder="14:00"
                />
              </div>
              <div className="">
                <p className="mt-2 -mb-1">Check-out time</p>
                <input
                  type="text"
                  className=" "
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  placeholder="13:00"
                />
              </div>
              <div className="">
                <p className="mt-2 -mb-1">Max number of guests</p>
                <input
                  type="number"
                  min="1"
                  className=""
                  value={maxGuest}
                  onChange={handleMaxGuestChange}
                />
              </div>
              <div className="">
                <p className="mt-2 -mb-1">Price per night</p>
                <input
                  type="number"
                  className=""
                  value={price}
                  onChange={(ev) => setPrice(ev.target.value)}
                />
              </div>
            </div>
            <div className="formButton">
              <button className="saveButton" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>)
    }

    {
      (!!id && !foundPlace)&&(
        <p> Error!!! Non-existent place_id</p>
      )
    }
    </>
  );
};

export default PlaceForm;
