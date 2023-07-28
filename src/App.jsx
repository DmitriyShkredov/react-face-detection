import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./helper";
import "./App.css";

const config = {
  width: 640,
  height: 640,
  facingMode: "user",
};

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const detect = async (net) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const face = await net.estimateFaces(video);
      const ctx = canvas.getContext("2d");
      drawMesh(face, ctx);
    }
  };

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 640 },
      scale: 0.8,
    });
    setInterval(() => detect(net), 50);
  };

  useEffect(() => {
    runFacemesh();
  }, []);

  return (
    <div className="wrapper">
      <Webcam videoConstraints={config} ref={webcamRef} />
      <canvas width={config.width} height={config.height} ref={canvasRef} />
    </div>
  );
}

export default App;
