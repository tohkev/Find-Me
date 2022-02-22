import React from "react";

import UserItem from "./UserItem.js";
import Card from "../../shared/components/UIElements/Card";
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
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return <ul className="users-list">{userItemElements}</ul>;
}

export default UserList;
