import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Jumbotron, ListGroup, ListGroupItem } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);
  function loadNotes() {
    return API.get("notes", "/notes");
  }
  function renderNotesList(notes) {
    console.log(notes);
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <Link key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroup.Item>
            <h4>{note.content.trim().split("\n")[0]}</h4>
            <span>
              {"Created: " + new Date(note.createdAt).toLocaleString()}
            </span>
          </ListGroup.Item>
        </Link>
      ) : (
        <Link key="new" to="/notes/new">
          <ListGroup.Item>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroup.Item>
        </Link>
      )
    );
  }
  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }
  function renderNotes() {
    return (
      <div className="notes">
        <Jumbotron>
          <h1>Your Notes</h1>
        </Jumbotron>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }
  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
