import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//route allows you to specify the route path to render a certain component
//redirect allows you to redirect the path when the one specified is unknown
//switch allows you to render only one route if that route applies (if none, then it will use redirect)
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Users />
        </Route>

        <Route path="/places/new" exact={true}>
          <NewPlace />
        </Route>

        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
