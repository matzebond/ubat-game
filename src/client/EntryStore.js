import { observable, computed } from "mobx";
require('es6-promise').polyfill();
import axios from "axios";

import Tag from "../data/Tag";
import Entry from "../data/Entry";

const backendAddr = "http://192.168.0.19:13750";

axios.defaults.baseURL = backendAddr;
axios.defaults.headers.post['Content-Type'] = 'application/json';

class EntryStore {
    @observable entries = [new Entry ({id:1, text:"DUMMY_ENTRY", tags:["DUMMY_TAG"]})];
    @observable tags = [new Tag({id: 1, text:"DUMMY_TAG", count: 1}) ];

    @computed get entryNames() {
        return this.entries.map(entry => entry.text);
    };

    @computed get tagNames() {
        return this.tags.map(tag => tag.text);
    };

    constructor() {
        this.sendEntry = this.sendEntry.bind(this);
        this.requestTags = this.requestTags.bind(this);

        this.requestTags();
    }

    requestTags() {
        axios.get("/tag/list")
            .then(res => {
                this.tags.replace(res.data.map(e => new Tag(e)));
            })
            .catch(err => {
                console.log(err);
            });
    }

    requestEntries() {
        axios.get("/entry/list")
            .then(res => {
                this.entries.replace(res.data.map(e => new Entry(e)));
            })
            .catch(err => {
                console.log(err);
            });
    }

    sendEntry(entry, callback = () => {}) {
        axios.post("/entry/add", entry)
            .then(res => {
                if (res.status !== 200) {
                    console.log(res);
                    callback(res.data);
                    // reject(body);
                    return;
                }

                const tags = res.data.tags.map(e => new Tag(e));
                this.tags.replace(tags);
                callback();
            })
            .catch(err => {
                console.log(err.response);
                callback(err.response);
            });
    }
}

export default new EntryStore;
