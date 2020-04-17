import React from 'react';
import './App.css';
import {
  Switch,
  Route
} from "react-router-dom";

import pink from '@material-ui/core/colors/pink';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from './views/login';
import Partners from './views/partners';
import Partner from './views/partner';
import PrivateRoute from './components/private-route';
import NoMatch from './views/no-match';
import { Subscription } from 'rxjs';
import httpClientService from './services/http-client.service';


// @see https://material-ui.com/customization/palette/
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#448aff',
    },
    secondary: pink,
  },
});


class App extends React.Component<{}, { concurrentCalls: number }>{

  state = {concurrentCalls:0};
  subHttpClientRequest: Subscription | null = null;
  subHttpClientResponse: Subscription | null = null;

  componentDidMount(){
      this.subHttpClientRequest = httpClientService.subOnRequest(() => {
        this.setState({concurrentCalls: this.state.concurrentCalls+1});
      });
      this.subHttpClientResponse = httpClientService.subOnResponse(() => {
        if(this.state.concurrentCalls > 0){
          this.setState({concurrentCalls: this.state.concurrentCalls-1});
        }
      });
  }

  componentWillUnmount(){
    this.subHttpClientRequest?.unsubscribe();
    this.subHttpClientResponse?.unsubscribe();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>

        <Backdrop className="backdrop" open={this.state.concurrentCalls !== 0}>
          <CircularProgress color="inherit" />
        </Backdrop>

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
            <NoMatch />
          </Route>
        </Switch>
      </MuiThemeProvider>
    );
  }
}
export default App;


// @see https://reacttraining.com/react-router/web/guides/primary-components

