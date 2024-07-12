import { useState, useEffect } from "react";
import Note from "../components/Note";
import api from "../api";
import "../styles/Home.css"

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState(""); 

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    console.log("Deleting note with id:", id);

    api
      .delete(`/api/notes/delete/${id}`)
      .then((res) => {
        console.log(res, "======================> test-1")
        if (res.status === 204) {
          alert("Note deleted!");
          getNotes();
        } else {
          alert(
            "Failed to delete note. Server responded with status: " + res.status
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        alert("Failed to delete note. Please try again later.");
      });
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        console.log(res);
        if (res.status === 201) alert("Note created!");
        else alert("Failed to make note.");
        getNotes();
      })
      .catch((err) => alert(err));
      setContent("")
      setTitle("")
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <button type="submit">Create Note</button>
      </form>
    </div>
  );
};

export default Home;
