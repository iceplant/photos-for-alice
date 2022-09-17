import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useState } from "react";
import axios from "axios";
import Upload from "./Upload.js";
import Slideshow from "./Slideshow.js";

function App() {
  const fileInputRef = useRef();

  const [file, setFile] = useState();
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

  const GetPhotos = async () => {
    const bucketParams = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      // Key: file.name,
      // Body: file,
    };
    const command = new ListObjectsCommand(bucketParams);
    const response = await s3Client.send(command);
  };

  return (
    <div className="App">
      <h1>Photos For Alice</h1>
      <h2>upload photos</h2>
      <Upload />
      <Slideshow />
    </div>
  );
}

export default App;
