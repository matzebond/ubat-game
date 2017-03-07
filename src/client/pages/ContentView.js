import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import request from "es6-request";


import AddEntry from "../components/AddEntry";

export default class Game extends React.Component {
    constructor() {
        super();

        this.sendEntry = this.sendEntry.bind(this);
    }

    sendEntry(entry) {
        const stringified = JSON.stringify(entry);
        console.log(stringified);
        request.post("http://localhost:13750/entry/add")
            .headers({
                "Content-Type": "application/json",
                "Content-Length": Buffer.from(stringified).byteLength
            })
            .send(stringified)
            .then(([body, res]) => {
                let jsResult = JSON.parse(body);
                console.log(jsResult);
                // resolve(jsResult);
            });
    }

    render () {
        return (
            <div>
                <h2>Make Webapps Great Again!</h2>
                <h3>Feel The Communtity</h3>
                <Switch>
                    <Route path="/content/edit" render={() => <p>content edit</p>} />
                    <Route path="/content/add" render={() =>
                        <AddEntry
                            sendEntry={this.sendEntry}
                            allTags={["Movie", "Series", "Politician", "Star", "Fictional", "Game of Thrones", "Sport"]}/>
                    }/>
                    <Route render={ () =>
                        <div>
                            <ul>
                                <li><Link to="/content/edit">Edit Database</Link></li>
                                <li><Link to="/content/add">Add Entry</Link></li>
                            </ul>
                        </div>
                    }/>
                </Switch>
            </div>
        );
    }
}
