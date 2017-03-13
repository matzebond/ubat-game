import React from "react";
import { observer } from "mobx-react";
import { Button, Alert } from "react-bootstrap";

import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest';

import "./Entry.css";

const tagRenderLayout = function (tagComponents, inputComponent) {
    return (
        <div>
            <div>
            {logger(tagComponents).length !== 0 ? tagComponents : <p>an entry needs at least one tag</p>}
            </div>
            {inputComponent}
        </div>
    );
};


const logger = a => {
    console.log(a, a !== []);
    return a;
}

@observer
export default class Entry extends React.Component {

    static defaultProps = {
        text: "",
        tags: [],
        id: null,
        onSubmit: function () {},
        onAbort: function () {}
    }

    constructor(props) {
        super(props);

        this.state = {
            text: this.props.text,
            tags: this.props.tags,
            tagValue: "",
            suggestions: [],
            send: false,
            submitErr: false
        };

        this.handleTagChange = this.handleTagChange.bind(this);
        this.onEntryTextChange = this.onEntryTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAbort = this.handleAbort.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
        this.autocompleteRenderInput = this.autocompleteRenderInput.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("willRecProps", nextProps);

        if (this.props === nextProps)
            return;

        this.setState({
            text: nextProps.text,
            tags: nextProps.tags
        });
    }

    getSuggestions (value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.store.tags.filter(tag =>
                                                         tag.text.toLowerCase().slice(0, inputLength) === inputValue
                                                        );
    };

    handleTagChange(tags) {
        this.setState({tags});
    }

    onEntryTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit() {
        const text = this.state.text;
        const tags = this.state.tags;
        const id = this.props.id;


        console.log(this.state.tags);

        this.props.onSubmit({id, text, tags}, this.submitCallback);

        this.setState({send: false, lastText: text});
    }

    handleAbort() {
        this.props.onAbort(this);
    }

    submitCallback(err) {
        if(err) {
            this.setState({send: true, submitErr: true});
        }
        else {
            console.log("callback");
            this.setState({text: "", tags: [], send: true, submitErr: false});
        }
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value }) {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };


    autocompleteRenderInput({addTag, ...props}) {
        const { suggestions, tagValue } = this.state;

        const onChange = (e, {newValue, method}) => {
            console.log(method);
            // if (method === 'enter') {

            // } else {
                this.setState({tagValue : newValue});
                // props.onChange(e);
            // }
        };

        const onKeyDown = (event) => {
            if (event.key === 'Enter') {
                console.log('Enter pressed!');
                addTag(tagValue);
                this.setState({tagValue: ""});
            }
        };

        const inputProps = {
            placeholder: 'Add a tag',
            value: tagValue,
            onChange,
            onKeyDown
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                getSuggestionValue={(tag) => tag.text}
                renderSuggestion={(tag) => <span>{tag.text}</span>}
                inputProps={inputProps}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionSelected={(e, {suggestion, suggestionValue}) => {
                    addTag(suggestionValue);
                    this.setState({tagValue: ""});
                }}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            />
        );
        // inputProps={{...props, onChange}}
        // alwaysRenderSuggestions={true}
    }


    render() {
        const {tags, text, send, submitErr, lastText} = this.state;

        return (
            <div>
                <p>Entry text: </p>

                <input className="form-control input-lg" value={text} onChange={this.onEntryTextChange} placeholder={'Enter phrase'}/>


                <TagsInput renderInput={this.autocompleteRenderInput} value={this.state.tags} onChange={this.handleTagChange} renderLayout={tagRenderLayout} onlyUnique/>

                <div>
                    <Button bsStyle="success" onClick={this.handleSubmit}>Save</Button>
                    <Button bsStyle="danger" onClick={this.handleAbort}>Back</Button>
                </div>

                {send ?
                    submitErr ?
                    <Alert bsStyle="danger">
                        <strong>Error!</strong> The entry "{lastText}" couln't be saved.
                    </Alert>
                    :
                    <Alert bsStyle="success">
                        <strong>Success!</strong> The entry "{lastText}" was saved.
                    </Alert>
                : null
                }
            </div>
        );
    }
}
