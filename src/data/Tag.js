import { observable } from "mobx";
import _ from 'underscore';

import Translation from "./Translation.js";

export default class Tag {
    @observable id;
    @observable text;
    @observable count;
    @observable trans;

    constructor({id, text, count, trans}) {
        this.id = id;
        this.text = text;
        this.count = count;
        this.trans = trans;
    }

    static fromDB({id, text, count, trans=[]}) {
        trans.map(row => new Translation(row));
        return new Tag({id, text, count, trans});
    }
}
