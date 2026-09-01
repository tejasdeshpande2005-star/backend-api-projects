const express = require("express");
const app = express();
app.use(express.json());
const notes = [];
let nextId = 1;

function createNotes(req,res){
    const title = req.body.title;
    const content = req.body.content;
    if(!title || !content ||title.trim() === "" || content.trim() === ""){
        return res.status(400).json({
            message: "Title and content are required"
        })
    }
    const note = {id:nextId++,
        title:title,
        content:content};
    notes.push(note);
    return res.json(note);
}

function listNotes(req,res){
    return res.json(notes);
}

function getNote(req,res){
    const id = Number(req.params.id);
    const index = notes.findIndex(note => note.id === id);
    if(index === -1){
        return res.status(404).json({
            message: "Note not found"
        });
    }
    return res.json(notes[index]);
}

function deleteNotes(req,res){
    const id = Number(req.params.id);
    const index = notes.findIndex(note => note.id === id);
    if(index === -1){
        return res.status(404).json({
            message: "Notes to be deleted not found."
        })
    }
    notes.splice(index,1);
    return res.status(200).json({
        message: "note deleted successfully"
    })

}

function updateNotes(req,res){
    const id = Number(req.params.id);
    const index = notes.findIndex(note => note.id === id);
    if(index === -1){
        return res.status(404).json({
            message: "note to be updated not found"
        });
    }
    const title = req.body.title;
    const content = req.body.content;
    if(!title || !content || title.trim() === "" || content.trim() === ""){
        return res.status(400).json({
            message: "Both title and content are requried for updatation."
        })
    }
    notes[index] = {id:id,
        title: req.body.title,
        content: req.body.content
    }
    return res.status(200).json(notes[index]);
}

app.post("/api/notes",createNotes);
app.get("/api/notes",listNotes);
app.get("/api/notes/:id",getNote);
app.delete("/api/notes/:id",deleteNotes);
app.put("/api/notes/:id",updateNotes);
app.listen(3000,()=>{
    console.log("SERVER Listening in PORT 3000");
});