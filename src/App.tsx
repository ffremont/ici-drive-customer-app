import React from 'react';
import './App.css';
import {
  Switch,
  Route
} from "react-router-dom";
import Home from "./views/home";
import Login from './views/login';
import Partners from './views/partners';
import Partner from './views/partner';
import PrivateRoute from './components/private-route';
import NoMatch from './views/no-match';



// @see https://reacttraining.com/react-router/web/guides/primary-components
function App() {
  return (
    <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <PrivateRoute exact path="/partners">
            <Partners />
          </PrivateRoute>

          <Route path="/partners/:id">
            <Partner />
          </Route>

          <Route path="*">
            <NoMatch/>
          </Route>
        </Switch>
    </div>
  );
}

export default App;
