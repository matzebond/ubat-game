import React from "react";
import { observer } from "mobx-react";
import { Route, Link , Switch } from "react-router-dom";
import { Badge } from "react-bootstrap";

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
                               <div>
                               <h3>Choose a tag</h3>
                               <ul>
                               <li><Link to="/game/random" > random tag</Link></li>
                               {tagLis}
                               </ul>
                               </div>
                              } />
            </Switch>
            </div>
        );
    }
}

let mapTags = (tag) => {
    return (
        <li key={tag.id - 1}>
            <Badge>{tag.count}</Badge>
            <Link to={"/game/"+ (tag.id-1)} > {tag.text} </Link>
        </li>
    );
};

let randomIntRange = (from, to) => {
    return Math.floor(Math.random() * (to + 1 - from)) + from;
}
