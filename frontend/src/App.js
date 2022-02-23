import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//route allows you to render a certain component based on the url path
//redirect allows you to redirect the path when the one specified is unknown
//switch allows you to render only one route if that route applies (if none, then it will use redirect)
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";

function App() {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact={true}>
            <Users />
          </Route>

          <Route path="/:userId/places" exact={true}>
            <UserPlaces />
          </Route>

          <Route path="/places/new" exact={true}>
            <NewPlace />
          </Route>

          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
