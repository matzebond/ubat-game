import React from "react";
import { observer } from "mobx-react";
import { Route, Link , Switch } from "react-router-dom";

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
                <Link to="/game/random" > random</Link>
            <Switch>
                <Route path="/game/:id" component={({match}) => <Game match={match}/>} />
                <Route render={() => <ul>{tagLis}</ul> } />
            </Switch>
            </div>
        );
    }
}

let mapTags = (tags) => {
    return (
        <li key={tags.id - 1}>
            <Link to={"/game/"+ (tags.id-1)} > {tags.text} </Link>
        </li>
    );
};

let randomIntRange = (from, to) => {
    return Math.floor(Math.random() * (to + 1 - from)) + from;
}
