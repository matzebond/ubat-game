import {observable} from "mobx";

import Tag from "./Tag.js";
import Translation from "./Translation.js";

export default class Entry {
    @observable id;
    @observable text;
    @observable tags;

    constructor({id=null, text="", tags=[], trans=[]}) {
        this.id = id;
        this.text = text;
        this.tags = tags;
        this.trans = trans;
    }

    static fromDB({id, text, tagIDs, trans=[]}) {
        const tags = tagIDs.split(';').map(id => Number(id));
        trans.map(row => new Translation(row));
        return new Entry({id, text, tags, trans});
    }
}
