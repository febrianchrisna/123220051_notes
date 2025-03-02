import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css";
import NoteForm from "./NoteForm";
import NoteItem from "./NoteItem";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getNotes();
    const interval = setInterval(getNotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const getNotes = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:5000/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to load notes. Please try again later.");
    }
  };

  const deleteNote = async (id) => {
    try {
      setError("");
      await axios.delete(`http://localhost:5000/delete-notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post("http://localhost:5000/add-notes", {
        title,
        content: description, // Changed from 'description' to 'content'
      });
      setTitle("");
      setDescription("");
      getNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to create note. Please try again.");
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    if (!selectedNote) return;

    try {
      setError("");
      await axios.put(`http://localhost:5000/update-notes/${selectedNote.id}`, {
        title,
        content: description, // Changed from 'description' to 'content'
      });
      getNotes();
      setTitle("");
      setDescription("");
      setSelectedNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note. Please try again.");
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setDescription(note.content); // Changed from 'description' to 'content'
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
    setTitle("");
    setDescription("");
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())  // Changed from 'description' to 'content'
  );

  return (
    <div className="app-container">
      <header>
        <h1>NoteX</h1>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {error && <div className="error-message">{error}</div>}
      </header>

      <div className="notes-container">
        <div className="form-container">
          <NoteForm
            selectedNote={selectedNote}
            title={title}
            setTitle={setTitle}
            content={description}
            setContent={setDescription}
            onSubmit={selectedNote ? updateNote : createNote}
            onCancel={handleCancelEdit}
          />
        </div>
        
        <div className="list-container">
          <div className="notes-list">
            <h2>Your Notes</h2>
            {filteredNotes.length === 0 ? (
              <div className="empty-notes">
                {searchQuery ? "No notes match your search" : "No notes yet. Create your first note!"}
              </div>
            ) : (
              <div className="notes-grid">
                {filteredNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onSelect={() => handleSelectNote(note)}
                    onDelete={() => deleteNote(note.id)}
                    isSelected={selectedNote && selectedNote.id === note.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteList;
