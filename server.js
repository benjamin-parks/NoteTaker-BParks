const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// root route that sends user to index.html
app.get("/", (req,res) =>{
    res.sendFile(__dirname + "index.html");
});


// GET route for /api/notes that sends user to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(__dirname + "/public/notes.html");
});

// GET route for /api/notes that shows db.json contents
app.get("/api/notes", (req, res) => {
    fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        res.json(notes);
    });
});

// POST route for /api/notes that reads db.json file and adds new note to it with unique id
app.post("/api/notes", (req, res) => {
    fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        let newNote = req.body;
        newNote.id = notes.length + 1;
        notes.push(newNote);
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});


// DELETE route for /api/notes that deletes note with specific id
app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id != id);
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json({ok: true});
        });
    });
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});