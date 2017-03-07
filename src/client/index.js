import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import App from "./pages/App";

const root = document.getElementById('root');
ReactDOM.render(
        <Router>
            <App/>
        </Router>
        , root);
