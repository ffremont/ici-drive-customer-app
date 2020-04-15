import React from 'react';
import {
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import authService from '../../services/auth.service';


const PrivateRoute = (props: RouteProps) => {
  const {children, ...rest} = props;
  return (
    <Route
    {...rest}
    render={({ location }) =>
        authService.isAuth ? (
          children
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
