import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import MainMenu from "./MainMenu";
import Game from "./Game";
import ContentView from "./ContentView";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default class App extends React.Component {
    render () {
        return (
            <div>
                <Header />
                <div>
                    <Switch>
                        <Route path="/game" component={Game}/>
                        <Route path="/content" component={ContentView}/>
                        <Route component={MainMenu}/>
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}
