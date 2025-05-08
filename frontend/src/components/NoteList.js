import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import "../styles/styles.css";
import NoteForm from "./NoteForm";
import NoteItem from "./NoteItem";
import { BASE_URL } from "../utils";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { logout, user, isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }
    
    getNotes();
    const interval = setInterval(getNotes, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token, navigate]);

  const getNotes = async () => {
    try {
      setError("");
      const response = await axios.get(`${BASE_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
        navigate('/login');
      } else {
        setError("Failed to load notes. Please try again later.");
      }
    }
  };

  const deleteNote = async (id) => {
    try {
      setError("");
      await axios.delete(`${BASE_URL}/delete-notes/${id}`);
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
      await axios.post(`${BASE_URL}/add-notes`, {
        title,
        content: description,
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
      await axios.put(`${BASE_URL}/update-notes/${selectedNote.id}`, {
        title,
        content: description,
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
    setDescription(note.content);
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
    setTitle("");
    setDescription("");
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Generate avatar with user's first letter
  const getAvatar = (username) => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  // Filter notes based on search query with null checks
  const filteredNotes = notes.filter(
    (note) => {
      const title = note.title || ''; // Use empty string if title is null/undefined
      const content = note.content || ''; // Use empty string if content is null/undefined
      const query = searchQuery.toLowerCase();
      
      return title.toLowerCase().includes(query) || 
             content.toLowerCase().includes(query);
    }
  );

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <h1>NoteX</h1>
          {user && (
            <div className="user-menu" ref={dropdownRef}>
              <div className="avatar-container" onClick={toggleDropdown}>
                <div className="user-avatar">
                  {getAvatar(user.username)}
                </div>
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <span className="dropdown-username">{user.username}</span>
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <span className="dropdown-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                        <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                      </svg>
                    </span>
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
