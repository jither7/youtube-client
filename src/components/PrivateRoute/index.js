import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {LocalStore} from "../../utils/LocalStore";

export default class PrivateRoute extends React.Component{

    render(){
        const { component: Component, RouteKey, location, ...rest } = this.props;

        /**
         * Sometimes we need to force a React Route to re-render when the
         * search params (query) in the url changes. React Router does not
         * do this automatically if you are on the same page when the query
         * changes. By passing the `RouteKey`ro the `ScrollToTopRoute` and
         * setting it to true, we are passing the combination of pathname and
         * search params as a unique key to the component and that is a enough
         * and clear trigger for the component to re-render without side effects
         */
        const Key = RouteKey ? location.pathname + location.search : null;

        return(
            <Route exact={true} {...rest} key={Key} render={props => {
                return (
                    LocalStore.getInstance().read('loginSession')
                        ? <Component {...props} />
                        : <Redirect to={{ pathname: '/authentication', state: { from: location } }} />
                )
            }} />
        );
    }
}