import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import { Button, ButtonGroup, Well } from "react-bootstrap";

import EditEntries from "./EditEntries";
import AddEntry from "./AddEntry";

export default class ContentView extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Well>
                <h2>Content Menu</h2>
                <Switch>
                    <Route path="/content/edit" component={EditEntries}/>
                    <Route path="/content/add" component={AddEntry}/>
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


