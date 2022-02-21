import React from "react";
import UserList from "../components/UserList";

function Users() {
  const USERS = [
    {
      id: "u1",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWpTm8D5Fdn0pulF4M6JcfL-QLu_aGDEtaMA&usqp=CAU",
      name: "Kevin Toh",
      places: 5,
    },
  ];

  return (
    <main>
      <UserList items={USERS} />
    </main>
  );
}

export default Users;
