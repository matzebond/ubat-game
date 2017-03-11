import React from "react";
import {observer} from "mobx-react";

import EntryStore from "../EntryStore";

import Entry from "../components/Entry";

@observer
export default class EditEntries extends React.Component {
    constructor() {
        super();

        console.log("request entries");
        EntryStore.requestEntries();
    }

    render() {
        console.log(JSON.stringify(EntryStore.entries));

        const entry = EntryStore.entries[0];
        console.log(JSON.stringify(entry));
        console.log(EntryLi(entry));


        const entriesLis = EntryStore.entries.map(entry => EntryLi(entry));

        return (
            <ul>
                {entriesLis}
            </ul>
        );
    }
}

const EntryLi = (entry) => (
        <li key={entry.id-1}>
        {entry.text}

        <Entry
            onSubmit={EntryStore.updateEntry}
            text={entry.text}
            tags={entry.tags}
            store={EntryStore} />
        </li>
)
