const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
let notesFile;

// async way to read file 
fs.readFile('./db/db.json', 'utf8', function (err, data) {
    notesFile = JSON.parse(data);
});

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());

// load css and javascript using middleware
app.use(express.static('public'));

// load saved notes
app.get('/api/notes', (req, res) => {
    res.json(notesFile.notes);
});

// add new notes/ route
app.post('/api/notes', (req, res) => {
    let notesArray = notesFile.notes;
    // create unique ID for each note
    req.body.id = uniqid();
    // req.body is where incoming content will be
    notesArray.push(req.body);
    console.log(notesArray);
    // add new note to the dbJson and turn into string for page
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray })
    );
    // send data to client server
    res.json(req.body)
});
    

// delete notes
app.delete('/api/notes/:notesID', (req,res) => {
    let filtered = notesFile.notes.filter( function (note) {
        if (note.id !== req.params.notesID) {
            return note
        }
    })
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: filtered})
    )
    res.json({ ok:true })
})

// dirname routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Wildcard Routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// call server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});

// validate notes