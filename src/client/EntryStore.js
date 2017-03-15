import { observable, computed } from "mobx";
require('es6-promise').polyfill();
import axios from "axios";

import Tag from "../data/Tag";
import Entry from "../data/Entry";


const backendIp = process.env.HEADS_UP_BACKEND_IP || "192.168.0.19";
const backendPort = parseInt(process.env.HEADS_UP_BACKEND_PORT, 10) || 13750;
const backendAddr = `http://${backendIp}:${backendPort}`;

axios.defaults.baseURL = backendAddr;
axios.defaults.headers.post['Content-Type'] = 'application/json';

class EntryStore {
    @observable entries = [new Entry ({id:1, text:"DUMMY_ENTRY", tags:["DUMMY_TAG"]})];
    @observable tags = [new Tag({id: 1, text:"DUMMY_TAG", count: 1}) ];

    @observable currentGameTag = this.tags[0];

    @computed get popularTags() {
        return this.tags.filter(t => t.count > 0).sort((a, b) => {
            return b.count - a.count;
        });
    }

    @computed get currentGameEntries() {
        return this.entries.filter( entry => {
            return entry.tags.includes(this.currentGameTag.text);
        });

    }

    constructor() {
        this.sendEntry = this.sendEntry.bind(this);
        this.requestTags = this.requestTags.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.updateEntry = this.updateEntry.bind(this);

        this.requestTags();
        this.requestEntries();
    }

    setCurrentGameTag(tag) {
        this.currentGameTag = tag;
    }

    requestTags() {
        axios.get("/tag/list")
            .then(res => {
                this.tags.replace(res.data.map(e => new Tag(e)));
                this.lastTagRequest = new Date();
                console.log("got tags");
            })
            .catch(err => {
                console.log(err);
            });
    }

    requestEntries() {
        axios.get("/entry/list")
            .then(res => {
                this.entries.replace(res.data.map(e => new Entry(e)));
                this.lastEntryRequest = new Date();
                console.log("got entries");
            })
            .catch(err => {
                console.log(err);
            });
    }

    sendEntry(entry, callback = () => {}) {
        console.log(entry);
        axios.post("/entry/add", entry)
            .then( res => {
                if (res.status !== 200) {
                    throw res.data;
                }

                // replace tags with received tags
                const tags = res.data.tags.map(e => new Tag(e));
                this.tags.replace(tags);
                this.lastTagRequest = new Date();
                callback();
            })
            .catch(err => {
                let errMsg = err.response ? err.response : err;
                console.log(errMsg);
                callback(errMsg);
            });
    }

    updateEntry(entry, callback = () => {}) {
        axios.post("/entry/update", entry)
            .then( res => {
                if (res.status !== 200) {
                    throw res.data;
                }

                // update entry in local storage
                console.log(this);
                const entries = this.entries.map(e => {
                    return (e.id === entry.id) ? entry : e;
                });
                this.entries.replace(entries);

                // replace tags with received tags
                const tags = res.data.tags.map(e => new Tag(e));
                this.tags.replace(tags);
                this.lastTagRequest = new Date();
                callback();
            })
            .catch(err => {
                let errMsg = err.response ? err.response : err;
                console.log(errMsg);
                callback(errMsg);
            });
    }

    deleteEntry(entryID, entryIndex) {
        axios.delete("/entry/delete/" + entryID)
            .then( res => {
                if (res.status !== 200) {
                    console.log(res);
                    return;
                }

                // remove entry from local storage
                if (entryIndex !== null) {
                    this.entries.splice(entryIndex, 1);
                }
            })
            .catch(err => {
                console.log(err.response);
            });
    }
}

export default new EntryStore;
