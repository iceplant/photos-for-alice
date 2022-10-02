import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useState } from "react";
import axios from "axios";
import Upload from "./Upload.js";
import Slideshow from "./Slideshow.js";

const masterPassword = "Carmines";

function App() {
  const fileInputRef = useRef();

  const [file, setFile] = useState();
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState();
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const url = "http://localhost:3000/uploadFile";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
    });
  }

  const checkPassword = () => {
    if (password === masterPassword) {
      setIsAuthed(true);
      return true;
    }
    return false;
  };

  return (
    <div className="App">
      {isAuthed ? (
        <>
          <h1>Photos For Alice</h1>
          <h2>upload photos</h2>
          <Upload />
          <Slideshow />
        </>
      ) : (
        <>
          <h1>Please enter the password</h1>
          <input
            name="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>password: {password}</div>
          <div onClick={checkPassword}>submit</div>
        </>
      )}
    </div>
  );
}

export default App;
