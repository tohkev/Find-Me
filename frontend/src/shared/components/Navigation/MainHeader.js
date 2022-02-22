import React from "react";

import "./MainHeader.css";

//props.children is the content between the opening and closing tags of your component (see MainNavigation)

function MainHeader(props) {
  return <header className="main-header">{props.children}</header>;
}

export default MainHeader;
