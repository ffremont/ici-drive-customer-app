import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from './views/login';
import Makers from './views/makers';
import PrivateRoute from './components/private-route';
import NoMatch from './views/no-match';
import { Subscription } from 'rxjs';
import httpClientService from './services/http-client.service';
import fcmService from './services/fcm.service';
import Catalog from './views/catalog';
import * as moment from 'moment';
import 'moment/locale/fr';
import Cart from './views/cart';
import Place from './views/place';
import Slots from './views/slots';
import MyOrders from './views/my-orders';
import Order from './views/order';
import Error from './views/error';
import MyProfil from './views/my-profil';
import How from './views/how';
import Concept from './views/concept';


// @see https://material-ui.com/customization/palette/
//const theme = createMuiTheme({ "palette": { "common": { "black": "#000", "white": "#fff" }, "background": { "paper": "#fff", "default": "#fafafa" }, "primary": { "light": "rgba(48, 49, 49, 0.84)", "main": "rgba(48, 49, 49, 1)", "dark": "rgba(38, 39, 39, 1)", "contrastText": "#fff" }, "secondary": { "light": "rgba(118, 143, 255, 1)", "main": "rgba(41, 98, 255, 1)", "dark": "rgba(0, 57, 203, 1)", "contrastText": "#fff" }, "error": { "light": "#e57373", "main": "#f44336", "dark": "#d32f2f", "contrastText": "#fff" }, "text": { "primary": "rgba(0, 0, 0, 0.87)", "secondary": "rgba(0, 0, 0, 0.54)", "disabled": "rgba(0, 0, 0, 0.38)", "hint": "rgba(0, 0, 0, 0.38)" } } });
const theme = createMuiTheme({"palette":{"common":{"black":"#000","white":"#fff"},"background":{"paper":"#fff","default":"#fafafa"},"primary":{"light":"rgba(74, 74, 74, 0.77)","main":"rgba(74, 74, 74, 1)","dark":"rgba(61, 61, 62, 1)","contrastText":"#fff"},"secondary":{"light":"rgba(255, 102, 0, 0.79)","main":"rgba(255, 102, 0, 1)","dark":"rgba(192, 77, 0, 1)","contrastText":"#fff"},"error":{"light":"#e57373","main":"#f44336","dark":"#d32f2f","contrastText":"#fff"},"text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"}}});


class App extends React.Component<{}, { concurrentCalls: number }>{

  state = { concurrentCalls: 0 };
  subHttpClientRequest: Subscription | null = null;
  subHttpClientResponse: Subscription | null = null;

  componentDidMount() {
    fcmService.init();
    moment.locale('fr');
    this.subHttpClientRequest = httpClientService.subOnRequest(() => {
      ///this.setState({ concurrentCalls: this.state.concurrentCalls + 1 });
    });
    this.subHttpClientResponse = httpClientService.subOnResponse(() => {
      if (this.state.concurrentCalls > 0) {
        //this.setState({ concurrentCalls: this.state.concurrentCalls - 1 });
      }
    });
  }

  componentWillUnmount() {
    this.subHttpClientRequest?.unsubscribe();
    this.subHttpClientResponse?.unsubscribe();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>

        <Backdrop className="backdrop" open={this.state.concurrentCalls !== 0}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Router>
          <Switch>
            {/*<Route exact path="/" render={(routeProps) => <Makers {...routeProps} />} />*/}

            <Route exact path="/" component={Makers} />
            <Route exact path="/makers" component={Makers} />
            <Route exact path="/how" component={How} />
            <Route exact path="/concept" component={Concept} />
            <Route path="/makers/:id/catalog" component={Catalog} />
            <Route path="/makers/:id/place" component={Place} />

            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/cart" component={Cart} />
            <PrivateRoute exact path="/cart/slots" component={Slots} />
            <PrivateRoute exact path="/cart/summary" component={Cart} />
            <PrivateRoute exact path="/my-orders" component={MyOrders} />            
            <PrivateRoute exact path="/my-orders/:id" component={Order} />            
            <PrivateRoute exact path="/my-profil" component={MyProfil} />            


            <Route path="/error" component={Error} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}
export default App;


// @see https://reacttraining.com/react-router/web/guides/primary-components


