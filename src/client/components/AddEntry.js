import React from "react";
import { WithContext as ReactTags } from 'react-tag-input';

export default class AddEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "Bill Gates",
            tags: [ {id: 1, text: "Programmer" }],
            suggestions: this.props.allTags
        };

        this.handleTagDelete = this.handleTagDelete.bind(this);
        this.handleTagAddition = this.handleTagAddition.bind(this);
        this.handleTagDrag = this.handleTagDrag.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAbort = this.handleAbort.bind(this);
    }

    handleTagDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleTagAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }

    handleTagDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit() {
        let {tags, text} = this.state;
        tags = tags.map(tag => tag.text);

        this.props.sendEntry({text, tags});
    }

    handleAbort() {
        console.log(this.match);
    }

    render() {
        let tags = this.state.tags;
        let suggestions = this.state.suggestions;

        return (
            <div>
                <p> Insert word: </p>
                <input className="form-control input-lg" value={this.state.text} onChange={this.handleTextChange} placeholder={'Enter phrase'}/>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    minQueryLength={1}
                    handleDelete={this.handleTagDelete}
                    handleAddition={this.handleTagAddition}
                    handleDrag={this.handleTagDrag}
                    classNames={{
                        tags: 'tagsClass',
                        tagInput: 'tagInputClass',
                        tagInputField: 'form-control input-sm',
                        selected: 'selectedClass',
                        tag: 'tagClass',
                        remove: 'removeClass',
                        suggestions: 'suggestionsClass'
                    }}
                />
                <div>
                    <button className="btn btn-success" onClick={this.handleSubmit}>Save</button>
                    <button className="btn btn-danger" onClick={this.handleAbort}>Cancel</button>
                </div>
            </div>
        );
    }
}
