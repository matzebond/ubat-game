import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import MainMenu from "./MainMenu";
import GameMenu from "./GameMenu";
import ContentView from "./ContentView";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../main.css";

export default class App extends React.Component {
    render () {
        return (
            <div>
                <Header />
                <div>
                    <Switch>
                        <Route path="/game" component={GameMenu}/>
                        <Route path="/content" component={ContentView}/>
                        <Route component={MainMenu}/>
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}
