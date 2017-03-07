import React from "react";
import { WithContext as ReactTags } from 'react-tag-input';

export default class AddEntry extends React.Component {
    constructor() {
        super();

        this.name = '';

        this.state = {
            tags: [  ],
            suggestions: ["Movie", "Series", "Politician", "Star", "Fictional", "Game of Thrones", "Sport"]
        };
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

    handleNameChange(e) {
        this.name = e.target.value;
        console.log(this.name);
    }

    handleSubmit() {
        console.log("submit: " + this.name);
    }

    handleAbort() {
        console.log("abort: " + this.name);
    }

    render() {
        let tags = this.state.tags;
        let suggestions = this.state.suggestions;
        return (
            <div>
                <p> Insert word: </p>
                <input className="form-control" onChange={this.handleNameChange.bind(this)}
                    placeholder={'Enter name'}/>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    minQueryLength={1}
                    handleDelete={this.handleTagDelete.bind(this)}
                    handleAddition={this.handleTagAddition.bind(this)}
                    handleDrag={this.handleTagDrag.bind(this)} />
                <div>
                    <button className="btn btn-success" onClick={this.handleSubmit.bind(this)}>Save</button>
                    <button className="btn btn-danger" onClick={this.handleAbort.bind(this)}>Cancel</button>
                </div>
            </div>
        );
    }
}
