import React from "react";

import { Link } from "react-router-dom";

export default class Header extends React.Component {
    render () {
        return (
            <header>
                image,
                <Link to="/">Home</Link>,
                language, option1, option2
            </header>
        );
    }
}
