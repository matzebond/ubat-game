import React from "react";
import { observer } from "mobx-react";
import TagsInput from "react-tagsinput";
import Autosuggest from "react-autosuggest";

import EntryStore from "../EntryStore.js";
import Tag from "../../data/Tag.js";


@observer
export default class TagsComponent extends React.Component {
    static propTyps = {
        tags: React.PropTypes.array,
        onTagsChange: React.PropTypes.func
    };

    static defaultProps = {
        tags: [],
        onTagsChange: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            text: "",
            tags: this.props.tags,
            suggestions: []
        };

        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.renderAutocompleteInput = this.renderAutocompleteInput.bind(this);
        this.renderTags = this.renderTags.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleTextKeyDown = this.handleTextKeyDown.bind(this);
    }

    addTag(newTag) {
        this.setState( ({ tags }) => {
            if (!tags.map(tag => tag.text).includes(newTag.text)) {
                tags.push(newTag);
                this.props.onTagsChange(tags);
                return {tags, text: ""};
            }
            else {
                return {text: ""};
            }
        });
    }

    removeTag(rTag) {
        this.setState(({ tags })=> {
            tags = tags.filter(tag => tag!= rTag);
            this.props.onTagsChange(tags);
            return { tags };
        });
    }

    getSuggestions (value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] :
            EntryStore.tags.filter(tag => {
                return tag.text.toLowerCase().slice(0, inputLength) === inputValue;
            });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value }) {
        this.setState({suggestions: this.getSuggestions(value)});
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
        this.setState({suggestions: []});
    };

    handleTextChange(e, {newValue, method, ...rest}) {
        // console.log(e, newValue, method, ...rest);
        // if (method === 'enter') {
        // } else {
        this.setState({text : newValue});
        // props.onChange(e);
        // }
    }

    handleTextKeyDown(event) {
        // console.log(event);
        const { text } = this.state;

        // allows to add new tags with Enter
        if (event.key === 'Enter' && text.length !== 0) {
            this.addTag(new Tag({text}));
        }
        // also add them with Tab
        else if (event.key === 'Tab' && text.length !== 0) {
            this.addTag(new Tag({text}));
            event.preventDefault();
        }
    }

    renderAutocompleteInput() {
        const { suggestions, text } = this.state;


        const inputProps = {
            placeholder: 'Add a tag',
            value: text,
            onChange: this.handleTextChange,
            onKeyDown: this.handleTextKeyDown
        };

        return (
            <Autosuggest
              suggestions={suggestions}
              getSuggestionValue={(tag) => tag.text}
              renderSuggestion={(tag) => <span>{tag.text}</span>}
              inputProps={inputProps}
              autoHighligth={true}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionSelected={(e, {suggestion}) => {this.addTag(suggestion);}}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              />
        );
        // alwaysRenderSuggestions={true}
    }

    renderTags() {
        const { tags } = this.state;

        const tagSpans = tags.map(tag => {
            return (
                <span className="react-tagsinput-tag">
                  {tag.text}
                  {tag.id == null? "**new**":""}
                  <a className="react-tagsinput-remove" onClick={this.removeTag.bind(this, tag)}></a>
                </span>
            );
        });

        return (
            <div>
              {tags.length > 0 ? tagSpans : "add at least one tag"}
            </div>
        );
    }

    render() {

        return (
            <div>
              {this.renderTags()}
              {this.renderAutocompleteInput()}
            </div>
        );
    }
}

