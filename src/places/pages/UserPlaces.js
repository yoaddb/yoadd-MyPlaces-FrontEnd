import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const userId = useParams().userId;
  const { error, isLoading, clearError, sendRequest } = useHttpClient();
  const [places, setPlaces] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setPlaces(data.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const onDeleteHandler = pid => {
    setPlaces(prevPlaces => prevPlaces.filter(p => p.id !== pid));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && places && (
        <PlaceList items={places} onDelete={onDeleteHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
