import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import { observer } from "mobx-react";

import EntryStore from "../EntryStore.js";

import AddEntry from "../components/AddEntry";

@observer
export default class Game extends React.Component {
    constructor() {
        super();
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
                            onSubmit={EntryStore.sendEntry}
                            store={EntryStore}/>
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
