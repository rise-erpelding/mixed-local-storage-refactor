/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import TokenService from '../services/token-service';

const PublicOnlyRoute = ({ component: Component, restricted, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      TokenService.hasAuthToken() && restricted
        ? <Redirect to="/my-groups" />
        : <Component {...props} />
    )}
  />
);

export default PublicOnlyRoute;
