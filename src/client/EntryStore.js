import { observable, computed } from "mobx";
import request from "es6-request";

import Tag from "../data/Tag";
import Entry from "../data/Entry";

const backendAddr = "http://localhost:13750";

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
        // this.sendEntry(new Entry({text:"matzeiaetaei", tags: ["Ich bin so cool"]}));

        setTimeout( () => {
            console.log(this.tagNames);
        }, 2000);

    }

    requestTags() {
        request.get(backendAddr + "/tag/list")
            .then(([body, res]) => {
                let jsResult = JSON.parse(body);
                console.log(this);
                console.log(JSON.stringify(this.tags));
                this.tags.replace(jsResult.map(e => new Tag(e)));
                console.log(JSON.stringify(this.tags));
            })
            .catch(err => {
                console.log(err);
            });
    }

    sendEntry(entry, callback = () => {}) {
        console.log('sending entry');
        console.log(entry);
        const stringified = JSON.stringify(entry);
        request.post(backendAddr + "/entry/add")
            .headers({
                "Content-Type": "application/json",
                "Content-Length": Buffer.from(stringified).byteLength
            })
            .send(stringified)
            .then(([body, res]) => {
                if (res.statusCode !== 200) {
                    console.log("entyAdd: status not 200" + body);
                    callback(body);
                    return undefined;
                    // reject(body);
                }
                const jsResult = JSON.parse(body);
                const tags = jsResult.tags.map(e => new Tag(e));
                this.tags.replace(tags);
                callback();
            })
            .catch(err => {
                console.log(err);
                callback(err);
            });
    }
}

export default new EntryStore;
