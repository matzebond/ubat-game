import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import { observer } from "mobx-react";

import EntryStore from "../EntryStore.js";

import EditEntries from "./EditEntries";
import Entry from "../components/Entry";

@observer
export default class ContentView extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <h2>Make Webapps Great Again!</h2>
                <h3>Feel The Communtity</h3>
                <Switch>
                    <Route path="/content/edit" component={EditEntries} />
                    <Route path="/content/add" render={() =>
                        <Entry
                            onSubmit={EntryStore.sendEntry}
                            text="Bill Gates"
                            tags={["Programmer", "Nerd"]}
                            store={EntryStore} />
                    }/>
                    <Route render={ () =>
                        <div>
                            <ul>
                                <li><Link to="/content/edit">Edit Entries</Link></li>
                                <li><Link to="/content/add">Add Entry</Link></li>
                            </ul>
                        </div>
                    }/>
                </Switch>
            </div>
        );
    }
}
