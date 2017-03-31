import React from "react";

import EntryStore from "../EntryStore.js";
import EntryCompoment from "../components/EntryComponent";


export default class AddEntry extends React.Component {
    constructor() {
        super();

        EntryStore.requestTags();
    }

    render() {
        return (
            <div>
              <h3>Add entry</h3>
              <EntryCompoment
                onSubmit={EntryStore.addEntry}
                onAbort={function (context) {
                    return true; // clear on abort
                }}
                clearOnSuccessCallback={true}
                store={EntryStore} />
            </div>
        );
    }
}
