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
                <Switch>
                    <Route path="/content/edit" component={EditEntries} />
                    <Route path="/content/add" render={() =>
                        <div>
                            <h3>Add entry</h3>
                            <Entry
                                onSubmit={EntryStore.sendEntry}
                                onAbort={function (context) {
                                    console.log(this);
                                    context.setState({text: "", tags: [], send: false});
                                }}
                                text="Bill Gates"
                                tags={["Programmer", "Nerd"]}
                                store={EntryStore} />
                        </div>
                    }/>
                    <Route render={ () =>
                        <div>
                            <ul>
                                <li><Link to="/content/add">Add Entry</Link></li>
                                <li><Link to="/content/edit">Edit Entries</Link></li>
                            </ul>
                        </div>
                    }/>
                </Switch>
            </div>
        );
    }
}
