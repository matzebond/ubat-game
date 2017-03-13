import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import { observer } from "mobx-react";
import { Button, ButtonGroup, Well } from "react-bootstrap";

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
            <Well>
                <h2>Content Menu</h2>
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
                        <ButtonGroup vertical block>
                            <Link to="/content/add"><Button bsSize="large" block>Add Entry</Button></Link>
                            <Link to="/content/edit"><Button bsSize="large" block>Edit Entries</Button></Link>
                        </ButtonGroup>
                    }/>
                </Switch>
            </Well>
        );
    }
}
