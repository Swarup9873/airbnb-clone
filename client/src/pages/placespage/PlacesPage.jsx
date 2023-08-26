import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./placesPage.css";
import PlaceList from "../../components/placelist/PlaceList";
import EditPlace from "../editPlace/EditPlace";
import PlaceForm from "../../components/placeForm/PlaceForm";

const PlacesPage = () => {
  const { action } = useParams();
  
  return (
    <div>
      {action === undefined && (
        <div className="placesDiv">
          <PlaceList/>
          <div className="text-center">
            <Link className="addLink" to={"/account/places/new"}>
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add new place
            </Link>
          </div>
        </div>
      )}
      {action === "new" && (
        <PlaceForm />
      )}
      {
        action !=="new" && action!==undefined&&(
          <EditPlace id={action}/>
        )
      }
    </div>
  );
};

export default PlacesPage;
