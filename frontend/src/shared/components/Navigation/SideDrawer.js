import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

//createPortal allows you to render a component outside of the usual 'root' element
//react transition group allows you to animate transitions for components that are rendered/unrendered
function SideDrawer(props) {
  const drawerContent = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(
    drawerContent,
    document.getElementById("drawer-hook")
  );
}

export default SideDrawer;
