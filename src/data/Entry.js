import {observable} from "mobx";

export default class Entry {
    @observable id;
    @observable text;
    @observable tags;

    constructor({id, text, tags}) {
        this.id = id;
        this.text = text;
        this.tags = tags;
    }
}
