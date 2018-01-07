import {observable} from "mobx";

export default class Translation {
    @observable abbr;
    @observable trans;

    constructor({abbr, trans}) {
        this.abbr = abbr;
        this.trans = trans;
    }
}
