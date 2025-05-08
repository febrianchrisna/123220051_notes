import express from 'express';
import { getNote, createNote, updateNote, deleteNote } from '../controller/NoteController.js';
import { login, register, logout } from '../controller/UserController.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

// CRUD NOTES
router.get('/notes', verifyToken, getNote);
router.post('/add-notes', verifyToken, createNote);
router.put('/update-notes/:id', verifyToken, updateNote);
router.delete('/delete-notes/:id', verifyToken, deleteNote);

// Endpoint user
router.get("/token", refreshToken);
router.post("/login", login);
router.post("/register", register);
router.get("/logout", verifyToken, logout);

export default router;