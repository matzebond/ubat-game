import React from "react";
import { WithContext as ReactTags } from 'react-tag-input';
import { observer } from "mobx-react";
import { Button, Alert } from "react-bootstrap";

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
            tags: this.props.tags.map((text, id) => ({id, text})),
            send: false,
            submitErr: false
        };

        this.handleTagDelete = this.handleTagDelete.bind(this);
        this.handleTagAddition = this.handleTagAddition.bind(this);
        this.handleTagDrag = this.handleTagDrag.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAbort = this.handleAbort.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("willRecProps", nextProps);

        if (this.props === nextProps)
            return;

        this.setState({
            text: nextProps.text,
            tags: nextProps.tags.map((text, id) => ({id, text}))
        });
    }

    handleTagDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags});
    }

    handleTagAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags});
    }

    handleTagDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({tags});
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit() {
        const text = this.state.text;
        const tags = this.state.tags.map(tag => tag.text);
        const id = this.props.id;

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

    render() {
        const {tags, text, send, submitErr, lastText} = this.state;
        const tagNames = this.props.store.tagNames;

        return (
            <div>
                <p>Entry text: </p>
                <input className="form-control input-lg" value={text} onChange={this.handleTextChange} placeholder={'Enter phrase'}/>
                <span>Tags: </span>
                <ReactTags tags={tags}
                    suggestions={tagNames}
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
