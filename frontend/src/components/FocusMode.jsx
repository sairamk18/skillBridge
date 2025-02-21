import { useState, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";

export default function FocusMode({ darkMode }) {
  const [isActive, setIsActive] = useState(false);
  const [model, setModel] = useState(null);
  const [warningMessage, setWarningMessage] = useState(""); // State for alert message
  const eyesClosedCountRef = useRef(0);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFaceMeshModel();
  }, []);

  useEffect(() => {
    if (isActive) {
      detectEyes();
    }
  }, [isActive]);

  const loadFaceMeshModel = async () => {
    try {
      const facemeshModel = await facemesh.load();
      setModel(facemeshModel);
      console.log("✅ FaceMesh model loaded!");
    } catch (error) {
      console.error("❌ Error loading FaceMesh model:", error);
    }
  };

  const calculateEAR = (eye) => {
    if (!eye || eye.length < 6) return 1; // Return high EAR if keypoints are missing

    const vertical1 = Math.hypot(eye[1][0] - eye[5][0], eye[1][1] - eye[5][1]);
    const vertical2 = Math.hypot(eye[2][0] - eye[4][0], eye[2][1] - eye[4][1]);
    const horizontal = Math.hypot(eye[0][0] - eye[3][0], eye[0][1] - eye[3][1]);

    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  const detectEyes = async () => {
    if (!model || !webcamRef.current || webcamRef.current.video.readyState !== 4) {
      requestAnimationFrame(detectEyes);
      return;
    }

    const video = webcamRef.current.video;
    const predictions = await model.estimateFaces(video, false);

    if (predictions.length > 0) {
      const keypoints = predictions[0].scaledMesh;

      if (!keypoints) {
        console.log("⚠️ No face detected!");
        requestAnimationFrame(detectEyes);
        return;
      }

      const leftEye = [keypoints[33], keypoints[160], keypoints[158], keypoints[133], keypoints[153], keypoints[144]];
      const rightEye = [keypoints[362], keypoints[385], keypoints[387], keypoints[263], keypoints[373], keypoints[380]];

      const leftEAR = calculateEAR(leftEye);
      const rightEAR = calculateEAR(rightEye);
      const avgEAR = (leftEAR + rightEAR) / 2;

      console.log("🔍 EAR:", avgEAR);

      if (avgEAR < 0.15) {
        eyesClosedCountRef.current += 1;
      } else {
        eyesClosedCountRef.current = 0;
      }

      if (eyesClosedCountRef.current >= 10) {
        triggerFocusAlert();
        eyesClosedCountRef.current = 0;
      }
    } else {
      console.log("⚠️ No face detected!");
    }

    if (isActive) {
      requestAnimationFrame(detectEyes);
    }
  };

  const triggerFocusAlert = () => {
    // Stop previous speech if any
    window.speechSynthesis.cancel();

    // Set the warning message
    setWarningMessage("🚨 Stay awake! Get back to work!");

    // Create a new speech message
    const message = new SpeechSynthesisUtterance("Stay awake! Get back to work!");
    message.rate = 1;
    message.volume = 1;

    // Speak the message
    window.speechSynthesis.speak(message);

    // Remove warning after 5 seconds
    setTimeout(() => setWarningMessage(""), 5000);
  };

  return (
    <Box textAlign="center" p={3} bgcolor={darkMode ? "#1E1E1E" : "#fff"} borderRadius={2}>
      <Typography variant="h5" color="primary">🔍 Focus Mode</Typography>

      <Webcam
        ref={webcamRef}
        style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
      />

      {/* Display warning message if eyes are closed */}
      {warningMessage && (
        <Typography variant="h6" color="error" sx={{ mt: 2, fontWeight: "bold" }}>
          {warningMessage}
        </Typography>
      )}

      <Box mt={2}>
        <Button
          variant="contained"
          color={isActive ? "secondary" : "primary"}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Stop Focus Mode" : "Start Focus Mode"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate("/")}
          sx={{ ml: 2 }}
        >
          ❌ Exit Focus Mode
        </Button>
      </Box>
    </Box>
  );
}

