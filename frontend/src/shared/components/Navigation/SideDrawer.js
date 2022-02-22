import React from "react";
import ReactDOM from "react-dom";

import "./SideDrawer.css";

//createPortal allows you to render a component outside of the usual 'root' element
function SideDrawer(props) {
  const drawerContent = <aside className="side-drawer">{props.children}</aside>;

  return ReactDOM.createPortal(
    drawerContent,
    document.getElementById("drawer-hook")
  );
}

export default SideDrawer;
