import React from "react";
import { observer } from "mobx-react";
import Select from 'react-select';

import EntryStore from "../EntryStore"

@observer
export default class LangSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            curLang: EntryStore.curLang
        }

        this.handleLangChange = this.handleLangChange.bind(this);
    }

    handleLangChange(newLang) {
        this.setState({curLang: newLang.value});
        EntryStore.setCurrentLang(newLang.value);
    }

    render() {
        const { langs } = EntryStore;

        const langOptions = langs.map(lang => {return {label: lang.name, value: lang.abbr}});

        return (
            <Select className="lang-select"
                    value={this.state.curLang}
                    onChange={this.handleLangChange}
                    options={langOptions}
            />
        );
    }
}
