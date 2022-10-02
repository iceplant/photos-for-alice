import React, { useState, useRef, useEffect } from "react";
import CREDENTIALS from "./credentials";
import "./Slideshow.css";
import {
  S3Client,
  ListObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

var AWS = require("aws-sdk");
const REGION = "us-east-1";

const s3Client = new S3Client({ region: REGION, credentials: CREDENTIALS });

const colors = ["#0088FE", "#00C49F", "#FFBB28"];
const delay = 2500;

function Slideshow() {
  const [index, setIndex] = useState(0);
  const [imageFileNames, setImageFileNames] = useState([]);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setIndex((prevIndex) => (prevIndex + 1) % imageFileNames.length),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const Photoslist = () => {
    useEffect(() => {
      const GetPhotos = async () => {
        const bucketParams = {
          Bucket: process.env.REACT_APP_BUCKET_NAME,
          // Key: file.name,
          // Body: file,
        };
        const command = new ListObjectsCommand(bucketParams);
        const response = await s3Client
          .send(command)
          .then((data) => {
            // console.log("data: ", data);
            // console.log("Contents: ", data.Contents);

            const newImageFileNames = data.Contents.map((item) => item.Key);
            // console.log("Filenames: ", newImageFileNames);
            setImageFileNames(newImageFileNames);
          })
          .catch((err) => console.error(err));
        // return response;
      };
      GetPhotos();
    }, []);
    return (
      <div>
        List of photos:
        {imageFileNames.map((name) => {
          return <div>{name}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="slideshow">
      <Photoslist />
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {imageFileNames.map((_, index) => {
          const s3ImagePath = `https://photos-for-alice.s3.amazonaws.com/${imageFileNames[index]}`;
          // `https://ashby-shellmound-media.s3.us-west-2.amazonaws.com/images/slideshow-images/${imageFileNames[index]}`.replace(
          //   " ",
          //   "+"
          // );

          return (
            <div className="slide" key={index}>
              <img
                className="slideshow-image"
                src={s3ImagePath}
                alt="cannot display"
              ></img>
            </div>
          );
        })}
      </div>

      <div className="slideshowDots">
        {imageFileNames.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;
