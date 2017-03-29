import {observable} from "mobx";

import Tag from "./Tag.js";

export default class Entry {
    @observable id;
    @observable text;
    @observable tags;

    constructor({id=null, text="", tags=[]}) {
        this.id = id;
        this.text = text;
        this.tags = tags;
    }

    static fromDB({id, text, tagIDs}) {
        const tags = tagIDs.split(';').map(id => new Tag({id}));
        return new Entry({id, text, tags});
    }
}
