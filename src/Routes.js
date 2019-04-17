import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/index';

import Dashboard from './containers/Dashboard';
import NotLoggedRoute from "./components/PrivateRoute/NotLoggedRoute";
import Page404 from "./components/Layout/404";

class Routes extends React.Component {
    render() {
        return (
            <HashRouter>
                <div className={'main-body'}>
                    <Switch>
                        <NotLoggedRoute exact={true} path="/" component={Dashboard} RouteKey={true}/>
                        <NotLoggedRoute exact={true} component={Page404}/>
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}

export default Routes;
