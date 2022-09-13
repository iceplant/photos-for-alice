import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useState } from 'react';
import axios from 'axios';

function App() {
  const fileInputRef=useRef();

  const [file, setFile] = useState();
  function handleChange(event) {
    setFile(event.target.files[0])
  }
  function handleSubmit(event) {
    event.preventDefault()
    const url = 'http://localhost:3000/uploadFile';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
    });

  }

  return (
    <div className="App">
      <h1>Photos For Alice</h1>
      <h2>upload photos</h2>
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Upload your file:
          <input type="file" id="my_file_input" onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
