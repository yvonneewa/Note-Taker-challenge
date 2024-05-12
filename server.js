const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'db', 'db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Function to read the notes from db.json
const getNotes = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading notes:', error);
        throw new Error('Failed to read notes');
    }
};

// Function to write the notes from db.json
const writeNotes = async (notes) => {
    try {
        await fs.writeFile(dbPath, JSON.stringify(notes));
    } catch (error) {
        console.error('Error writing notes:', error);
        throw new Error('Failed to write notes');
    }
};

// Function to add a new note to db.json
const addNote = async (newNote) => {
    try {
        const notes = await getNotes();
        newNote.id = notes.length + 1; // Assign a unique ID
        notes.push(newNote);
        await writeNotes(notes);
    } catch (error) {
        console.error('Error adding note:', error);
        throw new Error('Failed to add note');
    }
};

// Function to delete a note from db.json
const deleteNote = async (id) => {
    try {
        let notes = await getNotes();
        notes = notes.filter(note => note.id !== id);
        await writeNotes(notes);
    } catch (error) {
        console.error('Error deleting note:', error);
        throw new Error('Failed to delete note');
    }
};

// GET /api/notes route??
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await getNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/notes route??
app.post('/api/notes', async (req, res) => {
    try {
        const newNote = req.body;
        await addNote(newNote);
        res.json({ message: 'Note added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/notes/:id route??
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteNote(id);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
  );
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
  );
  
   


// To Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
