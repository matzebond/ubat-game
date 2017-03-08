const express = require('express');
const bodyParser = require('body-parser');

const myDB = require('./database3');

const port = 13750;
const app = express();

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(allowCrossDomain);


app.get('/tag/list', (request, response) => {
    myDB.listTags((tags) => {
        response.json({tags});
    });
});

app.get('/entry/:id', (request, response) => {
    myDB.getEntry( request.params.id, (entry) => {
        response.json(entry);
    });
});

app.get('/entry/list', (request, response) => {
    myDB.getEntry( request.params.id, (entry) => {
        response.json(entry);
    });
});

app.post('/entry/add', (request, response) =>  {
    console.log('post at /entry/add');
    console.log(JSON.stringify(request.body));

    let text = request.body.text;
    let tags = request.body.tags;
    myDB.addEntry({text, tags}, (entryID) => {
        if (!entryID) {
            response.status(400).send('Entry already exists.').end();
            return;
        }
        response.status(200).json({entryID});
    });
});

let server = app.listen(port, (err) => {
    if (err) {
        console.log('something bad happened', err);
        return;
    }
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Example app listening at http://${host}:${port}`);

    // myDB.addEntry({ text: "John Snow", tags: [ "Game of Thrones", "Series", "Character" ] });

    setTimeout( () => {
        myDB.listTags( rows => console.log(JSON.stringify(rows.map(e => `${e.text} ${e.count}`))) );
        myDB.listEntries( rows => console.log(JSON.stringify(rows.map(e => `${e.text} ${e.tags.length}`))));
    } , 500);
});
