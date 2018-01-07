import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import Select from 'react-select';
import screenfull from "screenfull";

import EntryStore from "../EntryStore"
import LangSelect from "./LangSelect.jsx"

@observer
export default class Header extends React.Component {


    toogleFullscreen() {
        if (screenfull.enabled) {
            screenfull.request();
        }
        else {
            screenfull.exit();
        }
    }


    handleFullscreen(e) {
        console.log(e);
        screenfull.toggle();
    }

    render() {
        return (
            <header style={{height: "35px"}}>
                <p style={{float: "left"}}>
                    {"Header: "}
                    <Link to="/">Home</Link>
                </p>
                <div style={{float: "right"}}>
                    <LangSelect />
                    <p>
                    <input type="checkbox"
                           checked={screenfull.isFullscreen}
                           onClick={this.handleFullscreen.bind(this)}/> fullscreen
                    </p>
                </div>
            </header>
        );
    }
}
