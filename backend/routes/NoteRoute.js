import express from 'express';
import { getNote, createNote, updateNote, deleteNote } from '../controller/NoteController.js';

const router = express.Router();

router.get('/notes', getNote);
router.post('/add-notes', createNote);
router.put('/update-notes/:id', updateNote);
router.delete('/delete-notes/:id', deleteNote);

export default router;