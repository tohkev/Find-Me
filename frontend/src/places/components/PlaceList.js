import React from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

function PlaceList(props) {
  const placeElements = props.items.map((item) => {
    return (
      <PlaceItem
        key={item.id}
        id={item.id}
        image={item.imageUrl}
        title={item.title}
        description={item.description}
        address={item.address}
        creatorId={item.creator}
        coordinates={item.location}
      />
    );
  });

  return props.items.length > 0 ? (
    <ul className="place-list">{placeElements}</ul>
  ) : (
    <div className="place-list center">
      <Card>
        <h2>No places found.</h2>
        <button>Share Place</button>
      </Card>
    </div>
  );
}

export default PlaceList;
