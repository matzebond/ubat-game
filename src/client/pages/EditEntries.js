import React from "react";
import {observer} from "mobx-react";
import {Button} from "react-bootstrap";

import EntryStore from "../EntryStore";

import Entry from "../components/Entry";

@observer
export default class EditEntries extends React.Component {
    constructor() {
        super();
        EntryStore.requestEntries();

        this.mapEntry = this.mapEntry.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.updateEntry = this.updateEntry.bind(this);

        this.state = {active : null};
    }

    updateEntry(id, index) {
        if (this.state.active === id){
            this.setState({active: null});
        }
        else {
            this.setState({active: id});
        }
    }

    deleteEntry(id, index) {
        console.log(id, index);
        EntryStore.deleteEntry(id, index);
        this.setState({active: null});
    }

    mapEntry(entry, index) {
        return (
            <li key={entry.id}>
                {entry.text}

                <Button bsStyle="primary" onClick={this.updateEntry.bind(this, entry.id, index)}>Edit</Button>
                <Button bsStyle="danger" onClick={this.deleteEntry.bind(this, entry.id, index)}>Delete</Button>

                {entry.id === this.state.active ?
                <Entry
                    onSubmit={EntryStore.updateEntry}
                    onAbort={() => { this.setState({active: null}); }}
                    id={entry.id}
                    text={entry.text}
                    tags={entry.tags}
                    store={EntryStore} />
                 : null
                }

            </li>
        );
    }

    render() {
        const entriesLis = EntryStore.entries.map((entry, index) => this.mapEntry(entry, index));

        return (
            <div>
                <h3>Edit or Delete entries</h3>
                <ul>
                    {entriesLis}
                </ul>
            </div>
        );
    }
}
