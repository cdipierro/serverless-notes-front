import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { API, Storage } from "aws-amplify";
import config from "../config";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import "./Notes.css";

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  async function handleSubmit(event) {
    let attachment;
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    setIsLoading(true);
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  function deleteNote() {
    console.log(id);
    return API.del("notes", `/notes/${id}`);
  }
  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;
    setIsDeleting(true);

    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }
  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content" bsSize="large">
            <Form.Control
              onChange={(e) => setContent(e.target.value)}
              as="textarea"
              value={content}
            />
          </Form.Group>
          {note.attachment && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>
              <a
                href={note.attachmentURL}
                rel="noopener_noreferrer"
                target="_blank"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatFilename(note.attachment),
                  }}
                />
              </a>
            </Form.Group>
          )}
          <Form.Group controlId="file" bsSize="large">
            {!note.attachment && <Form.Label>Attachment</Form.Label>}
            <Form.File
              id="custom-file"
              label="Upload Attachment"
              onChange={handleFileChange}
            />
          </Form.Group>
          <LoaderButton
            block
            variant="primary"
            disabled={!validateForm()}
            isLoading={isLoading}
            type="submit"
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            variant="danger"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
