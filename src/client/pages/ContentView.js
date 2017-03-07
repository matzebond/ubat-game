import React from "react";

import { Route, Link, Switch } from "react-router-dom";

import AddEntry from "../components/AddEntry";

export default class Game extends React.Component {
    render () {
        return (
            <div>
                <Switch>
                    <Route path="/content/add" component={AddEntry} />
                    <Route component={Menu}></Route>
                </Switch>
            </div>
        );
    }
}

const Menu = () => (
        <div>
            <ul>
                <li><Link to="/content/edit">Edit Database</Link></li>
                <li><Link to="/content/add">Add Entry</Link></li>
            </ul>
        </div>
);
