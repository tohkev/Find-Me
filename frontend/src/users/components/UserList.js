import React from "react";
import UserItem from "./UserItem.js";
import "./UserList.css";

function UserList(props) {
  const userItemElements = props.items.map((user) => {
    return (
      <UserItem
        key={user.id}
        id={user.id}
        image={user.image}
        name={user.name}
        placeCount={user.places}
      />
    );
  });

  if (userItemElements.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }

  return <ul>{userItemElements}</ul>;
}

export default UserList;
