import { observable } from "mobx";

export default class Tag {
    @observable id;
    @observable text;
    @observable count;

    constructor({id, text, count}) {
        this.id = id;
        this.text = text;
        this.count = count;
    }
}
