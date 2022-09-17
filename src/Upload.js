import React, { useState } from "react";
// import S3 from "react-aws-s3";

import {
  S3Client,
  PutObjectCommand,
  EnvironmentCredentials,
} from "@aws-sdk/client-s3";
// var creds = new EnvironmentCredentials('AWS');

// var fs = require("fs");
var AWS = require("aws-sdk");

const REGION = "us-east-1";

// https://stackoverflow.com/questions/62612082/credential-is-missing-error-on-instantiating-s3-class-using-aws-sdk-js-v3
const CREDENTIALS = {
  accessKeyId: process.env.REACT_APP_ACCESS,
  secretAccessKey: process.env.REACT_APP_SECRET,
};

// TODO: before doing this, we must config sdk with access tokens. probably on different page of aws docs
const s3Client = new S3Client({ region: REGION, credentials: CREDENTIALS });

// installed using npm install buffer --save
window.Buffer = window.Buffer || require("buffer").Buffer;

// a React functional component, used to create a simple upload input and button

//TODO: generate uuid for images
const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // the configuration information is fetched from the .env file
  const config = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS,
    secretAccessKey: process.env.REACT_APP_SECRET,
  };

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    console.log("reached upload function");
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_ACCESS,
      secretAccessKey: process.env.REACT_APP_SECRET,
      region: "us-east-1",
    });
    const bucketParams = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: file.name,
      Body: file,
    };
    console.log(bucketParams);

    const data = s3Client
      .send(new PutObjectCommand(bucketParams))
      .then((data) => console.log(data.location))
      .catch((err) => console.error(err));

    // attempt 2: https://flaviocopes.com/node-aws-s3-upload-image/

    // const s3 = new AWS.S3({
    //   accessKeyId: process.env.REACT_APP_ACCESS,
    //   secretAccessKey: process.env.REACT_APP_SECRET,
    // });
    // const imageURL = "/Users/rockykamenrubio/Downloads/penguins.jpeg";
    // const res = await fetch(imageURL);
    // const blob = await res.buffer();
    // console.log(blob);
    // const uploadedImage = await s3Client
    //   .upload(bucketParams)
    //   .promise()
    //   .then((data) => console.log(data.location))
    //   .catch((err) => console.error(err));
    // // console.log(uploadedImage);
  };
  return (
    <div>
      <div>React S3 File Upload</div>
      <input type="file" onChange={handleFileInput} />
      <br></br>
      <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div>
  );
};

export default Upload;
