import React from "react";
import { observer } from "mobx-react";
import TagsInput from "react-tagsinput";
import Autosuggest from "react-autosuggest";

import EntryStore from "../EntryStore.js";


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

        this.handleTagChange = this.handleTagChange.bind(this);

        this.autocompleteRenderInput = this.autocompleteRenderInput.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
    }

    addTag(text) {

    }

    getSuggestions (value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] :
            EntryStore.tags.filter(tag =>
                                         tag.text.toLowerCase().slice(0, inputLength) === inputValue
                                        );
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


    handleTagChange(tags) {
        this.props.onTagsChange(tags);
        this.setState({tags});
    }

    autocompleteRenderInput({addTag, ...props}) {
        const { suggestions, text } = this.state;

        const onChange = (e, {newValue, method, ...rest}) => {
            // console.log(e, newValue, method, ...rest);
            // if (method === 'enter') {
            // } else {
                this.setState({text : newValue});
                // props.onChange(e);
            // }
        };

        const onKeyDown = (event) => {
            // console.log(event);

            // allows to add new tags with Enter
            if (event.key === 'Enter') {
                addTag(text);
                this.setState({text: ""});
            }
            // also add them with Tab
            else if (event.key === 'Tab' && text.length !== 0) {
                addTag(text);
                this.setState({text: ""});
                event.preventDefault();
            }
        };

        const inputProps = {
            placeholder: 'Add a tag',
            value: text,
            onChange,
            onKeyDown
        };

        return (
            <Autosuggest
              suggestions={suggestions}
              getSuggestionValue={(tag) => tag.text}
              renderSuggestion={(tag) => <span>{tag.text}</span>}
              inputProps={inputProps}
              autoHighligth={true}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionSelected={(e, {suggestion, suggestionValue}) => {
                  console.log(e, suggestion, suggestionValue);
                  addTag(suggestionValue);
                  this.setState({text: ""});
              }}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              />
        );
        // inputProps={{...props, onChange}}
        // alwaysRenderSuggestions={true}
    }

    render() {

        return (
            <TagsInput renderInput={this.autocompleteRenderInput}
                       value={this.state.tags}
                       onChange={this.handleTagChange}
                       renderLayout={tagRenderLayout}
                       onlyUnique/>
        );
    }
}

const tagRenderLayout = function (tagComponents, inputComponent) {
    return (
        <div>
          <div>
            {tagComponents.length !== 0 ? tagComponents : <p>an entry needs at least one tag</p>}
          </div>
          {inputComponent}
        </div>
    );
};
