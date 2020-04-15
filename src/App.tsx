import React from 'react';
import './App.css';
import {
  Switch,
  Route
} from "react-router-dom";

import pink from '@material-ui/core/colors/pink';
import { MuiThemeProvider, createMuiTheme   } from '@material-ui/core/styles';
//import Home from "./views/home";
import Login from './views/login';
import Partners from './views/partners';
import Partner from './views/partner';
import PrivateRoute from './components/private-route';
import NoMatch from './views/no-match';


// @see https://material-ui.com/customization/palette/
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#448aff',
    },
    secondary: pink,
  },
});

// @see https://reacttraining.com/react-router/web/guides/primary-components
function App() {
  return (
    <MuiThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <Partners />
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
    </MuiThemeProvider>
  );
}

export default App;
