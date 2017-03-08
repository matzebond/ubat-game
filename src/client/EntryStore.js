import { observable, computed } from "mobx";
import request from "es6-request";

const backendAddr = "http://localhost:13750";

class Entry {
    @observable id;
    @observable text;
    @observable tags;

    constructor({id, text, tags}) {
        this.id = id;
        this.text = text;
        this.tags = tags;
    }
}

class Tag {
    @observable id;
    @observable text;
    @observable count;

    constructor({id, text, count}) {
        this.id = id;
        this.text = text;
        this.count = count;
    }
}

class EntryStore {
    @observable entries = [new Entry ({id:1, text:"DUMMY_ENTRY", tags:["DUMMY_TAG"]})];
    @observable tags = [new Tag({id: 1, text:"DUMMY_TAG", count: 1}) ];

    @computed get entryNames() {
        return this.entries.map(entry => entry.text);
    };

    @computed get tagNames() {
        return this.tags.map(tag => tag.text);
    };

    requestTags() {
        request.get(backendAddr + "/tag/list")
            .then(([body, res]) => {
                let jsResult = JSON.parse(body);
                console.log(jsResult);
                // resolve(jsResult);
                console.log(this.tags);
                this.tags.replace(jsResult.map(e => new Tag(e)));
                console.log(this.tags);
            });
    }

    sendEntry(entry) {
        const stringified = JSON.stringify(entry);
        console.log('sending entry');
        console.log(stringified);
        request.post(backendAddr + "/entry/add")
            .headers({
                "Content-Type": "application/json",
                "Content-Length": Buffer.from(stringified).byteLength
            })
            .send(stringified)
            .then(([body, res]) => {
                let jsResult = JSON.parse(body);
                console.log(jsResult);
                this.tags.replace(jsResult.tags.map(e => new Tag(e)));
            });
    }
}

export default new EntryStore;
