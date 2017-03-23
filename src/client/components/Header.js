import React from "react";
import { Link } from "react-router-dom";
import screenfull from "screenfull";

export default class Header extends React.Component {


    toogleFullscreen() {
        if (screenfull.enabled) {
            screenfull.request();
        }
        else {
            screenfull.exit();
        }
    }


    handler(e) {
        console.log(e);
        screenfull.toggle();
    }

    render() {
        return (
            <header style={{height: "25px"}}>
                <p style={{float: "left"}}>
                    {"Header: "}
                    <Link to="/">Home</Link>
                </p>
                <p style={{float: "right"}}>
                    <input type="checkbox" onClick={this.handler.bind(this)}/> fullscreen
                </p>
            </header>
        );
    }
}
