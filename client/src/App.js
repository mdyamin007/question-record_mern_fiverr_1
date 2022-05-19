import React, { useEffect, useRef, useState } from "react";
import useMediaRecorder from "@wmik/use-media-recorder";
import axios from "axios";

function LiveStreamPreview({ stream }) {
  let videoPreviewRef = React.useRef();

  useEffect(() => {
    if (videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return (
    <video
      className=""
      ref={videoPreviewRef}
      width={520}
      height={480}
      autoPlay
    />
  );
}

function Player({ srcBlob, audio }) {
  if (!srcBlob) {
    return null;
  }

  if (audio) {
    return <audio src={URL.createObjectURL(srcBlob)} controls />;
  }

  return (
    <video
      src={URL.createObjectURL(srcBlob)}
      width={520}
      height={480}
      controls
    />
  );
}

function App() {
  const ref = useRef(null);

  let {
    error,
    status,
    mediaBlob,
    stopRecording,
    getMediaStream,
    startRecording,
    liveStream,
  } = useMediaRecorder({
    recordScreen: false,
    blobOptions: { type: "video/mp4" },
    mediaStreamConstraints: { audio: true, video: true },
  });

  const handleRecording = async () => {
    await startRecording();
    setTimeout(() => {
      console.log("Clicked!");
      ref.current.click();
    }, 3000);
  };

  // console.log(mediaBlob);

  if (status === "stopped") {
    if (mediaBlob) {
      console.log(mediaBlob);
      const formData = new FormData();
      formData.append("image", mediaBlob);
      axios.post("http://localhost:3002", formData);
    }
  }

  return (
    <article>
      <p className="text-red-600 text-center text-base font-semibold my-4">
        {error ? `${status} ${error.message}` : status}
      </p>
      <section>
        <div className="container mx-auto">
          <div className="flex flex-col justify-center items-center">
            <div
              style={{ height: "354px", width: "472px" }}
              className="bg-black border-4 border-red-600 my-4"
            >
              <LiveStreamPreview stream={liveStream} />
            </div>
            <button
              type="button"
              onClick={handleRecording}
              disabled={status === "recording"}
              className="px-2 py-2 bg-green-600 text-white rounded"
            >
              Start recording
            </button>
          </div>
        </div>
        <button ref={ref} type="button" onClick={stopRecording} hidden>
          Stop recording
        </button>
      </section>
    </article>
  );
}

export default App;
