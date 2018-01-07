import React from "react";
import { observer } from "mobx-react";
import { Button, Alert } from "react-bootstrap";
import Autosuggest from 'react-autosuggest';

import Entry from "../../data/Entry.js";
import EntryStore from "../EntryStore.js";

import ResponseAlert from "./ResponseAlert";
import TagsComponent from "./TagsComponent";
import TranslationsComponent from "./TranslationsComponent";

import "./Entry.css";


@observer
export default class EntryCompoment extends React.Component {

    static propTyps = {
        entry: React.PropTypes.instanceOf(Entry),
        onSubmit: React.PropTypes.func,
        onAbort: React.PropTypes.func,
        clearOnSuccessCallback: React.PropTypes.bool
    };

    static defaultProps = {
        entry: new Entry({}),
        clearOnSuccessCallback: true,
        onSubmit: function () {},
        onAbort: function () {}
    }

    constructor(props) {
        super(props);

        this.state = {
            text: this.props.entry.text,
            tags: this.props.entry.tags,
            translations: this.props.entry.translations,
            send: false,
            gotSubmitErr: false
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleTranslationsChange = this.handleTranslationsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAbort = this.handleAbort.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("entry willRecProps", nextProps);

        if (this.props === nextProps)
            return;

        this.setState({
            text: nextProps.entry.text,
            tags: nextProps.entry.tags
        });
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleTagsChange(tags) {
        console.log(JSON.stringify(tags));
        this.setState({ tags });
    }

    handleTranslationsChange(translations) {
        this.setState({ translations })
    }

    handleSubmit() {
        const { text, tags, translations } = this.state;
        const id = this.props.entry.id;

        this.props.onSubmit(new Entry({id, text, tags, trans: translations}), this.submitCallback);

        this.setState({send: false, lastText: text});
    }

    handleAbort() {
        let shouldClear = this.props.onAbort(this);
        if (shouldClear) {
            this.setState({text: "", tags: [], send: false, gotSubmitErr: false});
        }
    }

    submitCallback(err) {
        if(err) {
            this.setState({send: true, gotSubmitErr: true, errorMsg: typeof err.data === 'string' ? err.data : ""});
        }
        else {
            if (this.props.clearOnSuccessCallback) {
                this.setState({text: "", tags: [], send: true, gotSubmitErr: false});
            }
            else {
                this.setState({send: true, gotSubmitErr: false});
            }
        }
    }

    render() {
        const { tags, text, send, gotSubmitErr, errorMsg, lastText } = this.state;

        return (
            <div className="entry-container">
                <p>Entry text: </p>

                <input className="form-control input-lg"
                       value={text}
                       placeholder={'Enter phrase'}
                       onChange={this.handleTextChange} />

                <span>Translations:</span>
                <TranslationsComponent
                    langs={EntryStore.langs.peek()}
                    onTranslationChange={this.handleTranslationsChange}/>

                <TagsComponent tags={tags} onTagsChange={this.handleTagsChange}/>

                <div>
                    <Button bsStyle="success" block onClick={this.handleSubmit}>Save</Button>
                    <Button bsStyle="danger" block onClick={this.handleAbort}>Back</Button>
                </div>

                <ResponseAlert show={send} error={gotSubmitErr} lastEntry={lastText} errorMsg={errorMsg}/>
            </div>
        );
    }
}
