const express = require('express');
const router = express.Router();
//for validating data
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
// Route1: Get all notes using get method:get/api/notes/fetchallnotes:Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })

        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }


})
// Route 2:Add a new note using post method:Post/api/notes/addnote:Login required
router.post('/addnote', fetchuser, [

    body('title', 'Enter a valid title').isLength({ min: 3 }),

    body('description', 'Description must be atleat 5 character').isLength({ min: 5 }),

], async (req, res) => {
    try {




        const { title, description, tag } = req.body;       //destructing 

        //if the errors occurs,return bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();

        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }
})
//Route 3:update an existing note using :PUT /api/notes /updatenote

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    //create a new note object
    try {
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        //find the note to be  updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");

        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    }

    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured")

    }
})
//Route 4:Delete an existing note using :Delete /api/notes /updatenote

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  

    //find the note to be  deleted and delete it
    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }
        //Allow deletion only if user own this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");

        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    }

    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")

    }
})


module.exports = router;