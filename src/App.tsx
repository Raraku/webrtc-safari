import { useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  // get video dom element
  window.onload = function () {
    const video = document.querySelector("video")!;

    console.log(video);

    // request access to webcam
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    navigator.mediaDevices
      .getUserMedia({ video: { width: 426, height: 240 } })
      .then((stream) => (video.srcObject = stream));

    // returns a frame encoded in base64
    const getFrame = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")!.drawImage(video, 0, 0);
      const data = canvas.toDataURL("image/png");
      return data;
    };

    const WS_URL = "ws://localhost:4000";
    const FPS = 3;
    const socket = io("https://e25f-105-112-184-59.ngrok.io/");
    console.log("so");
    socket.on("connect", () => {
      console.log("hey");
      console.log(`Connected to ${WS_URL}`);
      setInterval(() => {
        console.log("sending");
        socket.send(getFrame());
      }, 1000 / FPS);
    });
  };

  return <video autoPlay></video>;
}

export default App;

// <header className="App-header">
//   <img src={logo} className="App-logo" alt="logo" />
//   <p>Hello Vite + React!</p>
//   <p>
//     <button type="button" onClick={() => setCount((count) => count + 1)}>
//       count is: {count}
//     </button>
//   </p>
//   <p>
//     Edit <code>App.tsx</code> and save to test HMR updates.
//   </p>
//   <p>
//     <a
//       className="App-link"
//       href="https://reactjs.org"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       Learn React
//     </a>
//     {' | '}
//     <a
//       className="App-link"
//       href="https://vitejs.dev/guide/features.html"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       Vite Docs
//     </a>
//   </p>
// </header>

// const peerConnections = {};
// const config = {
//   iceServers: [
//     {
//       urls: "stun:stun.l.google.com:19302",
//     },
//     // {
//     //   "urls": "turn:TURN_IP?transport=tcp",
//     //   "username": "TURN_USERNAME",
//     //   "credential": "TURN_CREDENTIALS"
//     // }
//   ],
// };

// const socket = io("ws://localhost:4000");
// console.log("so");
// socket.on("connect", () => {
//   console.log("hey");
// stream
//   .getTracks()
//   .forEach((track) => peerConnection.addTrack(track, stream));

//   window.onunload = window.onbeforeunload = () => {
//     socket.close();
//   };
//   // Get camera and microphone
//   const videoElement = document.querySelector("video");

//   getStream();

//   function getStream() {
//     if (window.stream) {
//       window.stream.getTracks().forEach((track) => {
//         track.stop();
//       });
//     }
//     const constraints = { audio: true, video: true };
//     return navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then(gotStream)
//       .catch(handleError);
//   }

//   function gotStream(stream: any) {
//     console.log(stream);
//     socket.emit("videoBlob", stream);
//   }

//   function handleError(error: any) {
//     console.error("Error: ", error);
//   }
// });
