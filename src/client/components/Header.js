import React from "react";

import { Link } from "react-router-dom";

export default class Header extends React.Component {
    render () {
        return (
            <header>
                {"Header: "}
                <Link to="/">Home</Link>
            </header>
        );
    }
}
