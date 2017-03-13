import React from "react";
import { observer } from "mobx-react";
import { Route, Link , Switch } from "react-router-dom";
import { Badge, Button, ButtonGroup, Well } from "react-bootstrap";

import EntryStore from "../EntryStore";

import Game from "./Game";

@observer
export default class GameMenu extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        EntryStore.requestTags();
    }

    render() {
        const tags = EntryStore.popularTags;

        const tagLis = tags.map(t => mapTags(t));

        return (
            <div>
            <Switch>
                <Route path="/game/:id" component={({match}) => <Game match={match}/>} />
                <Route render={() =>
                               <Well>
                               <h2>Choose a tag</h2>
                               <ButtonGroup vertical block>
                               <Link to="/game/random"><Button block bsSize="large"> random</Button></Link>
                               {tagLis}
                               </ButtonGroup>
                               </Well>
                              } />
            </Switch>
            </div>
        );
    }
}

let mapTags = (tag) => {
    return (
        <Link key={tag.id} to={"/game/"+ (tag.id)}>
            <Button bsSize="large" block>
            {tag.text}
            <Badge>{tag.count}</Badge>
            </Button>
        </Link>
    );
};

let randomIntRange = (from, to) => {
    return Math.floor(Math.random() * (to + 1 - from)) + from;
}
