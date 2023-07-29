import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./helper";
import { config, dtConfig } from "./config";
import "./App.css";

export const App = () => {
  const [isEnabled, setEnabled] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runDetector = async () => {
    const detector = await facemesh.load(dtConfig);
    const detect = async (net) => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        canvasRef.current.width = webcamRef.current.video.videoWidth;
        canvasRef.current.height = webcamRef.current.video.videoHeight;
        const face = await net.estimateFaces(webcamRef.current.video);
        const ctx = canvasRef.current.getContext("2d");
        requestAnimationFrame(() => drawMesh(face, ctx));
        detect(detector);
      }
    };
    detect(detector);
  };

  useEffect(() => {
    setTimeout(() => runDetector(), 500);
  }, [isEnabled]);

  return (
    <>
      {isEnabled && (
        <>
          <Webcam videoConstraints={config} ref={webcamRef} />
          <canvas width={config.width} height={config.height} ref={canvasRef} />
        </>
      )}
      <button onClick={() => setEnabled(!isEnabled)}>
        {isEnabled ? "On" : "Off"}
      </button>
    </>
  );
};
