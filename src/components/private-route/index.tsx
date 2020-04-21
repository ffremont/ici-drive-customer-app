import React from 'react';
import {
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import authService from '../../services/auth.service';


const PrivateRoute = (props: RouteProps) => {
  const {children, ...rest} = props;
  const component:any = props.component;
  return (
    <Route
    {...rest}
    render={({ location, history, match }) =>
        authService.isAuth ? (
          /*React.Children.map(children, (child:any) =>
            React.createElement(child, {history,location})
          ) */
          React.createElement(component, {location, history, match})
        ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: location, navigateTo: location }
                    }}
                />
            )
    }
/>
  );
};


export default PrivateRoute;
