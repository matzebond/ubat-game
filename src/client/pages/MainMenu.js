import React from "react";

import { Link } from "react-router-dom";

export default class MainMenu extends React.Component {
    render () {
        return (
                <ul>
                <li><Link to="/game">Start Game</Link></li>
                <li><Link to="/content">Edit Content</Link></li>
                </ul>
        );
    }
}
