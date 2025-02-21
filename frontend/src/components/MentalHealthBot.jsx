import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton, CircularProgress } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { motion } from "framer-motion";
import ScrollToBottom from "react-scroll-to-bottom";

const MENTAL_HEALTH_API_URL = "http://127.0.0.1:5000"; // ✅ Updated API URL

export default function MentalHealthBot({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (endpoint) => {
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");
    setLoading(true);

    try {
      // ✅ Fix: Ensure "get_therapy" sends "mood" instead of "text"
      const payload = endpoint === "get_therapy"
        ? { mood: message }  // ✅ "get_therapy" expects "mood"
        : { user_id: "sairam", text: message }; // ✅ Other endpoints expect "text"

      const res = await axios.post(`${MENTAL_HEALTH_API_URL}/${endpoint}`, payload);

      setChatHistory((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: res.data.mood_analysis || res.data.risk_analysis || res.data.therapy_recommendations 
        },
      ]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: "bot", text: "Error: Unable to connect." }]);
    }

    setLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            left: 20, // ✅ Placing on the left side
            bgcolor: darkMode ? "#444" : "#1976D2",
            color: "white",
            width: 60,
            height: 60,
            borderRadius: "50%",
            boxShadow: 3,
            "&:hover": { bgcolor: darkMode ? "#333" : "#1565C0" },
          }}
        >
          <PsychologyIcon sx={{ fontSize: 30 }} />
        </IconButton>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: 80,
            left: 20,
            width: 320,
            zIndex: 1000,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: darkMode ? "#1E1E1E" : "white",
              color: darkMode ? "white" : "black",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">🧠 Mental Wellness Bot</Typography>
              <IconButton onClick={() => setIsOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <ScrollToBottom className="chat-container" style={{ height: 250, overflowY: "auto", border: "1px solid #ddd", borderRadius: 2, p: 1, mb: 2 }}>
              {chatHistory.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <Box sx={{ p: 1, borderRadius: 2, maxWidth: "70%", bgcolor: msg.sender === "user" ? "#1976D2" : "#E0E0E0", color: msg.sender === "user" ? "white" : "black" }}>
                    {msg.text}
                  </Box>
                </motion.div>
              ))}
            </ScrollToBottom>

            <TextField fullWidth label="Tell me how you feel..." variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} sx={{ mb: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" onClick={() => sendMessage("analyze_mood")} disabled={loading}>
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Check Mood"}
              </Button>

              <Button variant="contained" color="secondary" onClick={() => sendMessage("emergency_check")} disabled={loading}>
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Emergency Check"}
              </Button>

              <Button variant="contained" color="success" onClick={() => sendMessage("get_therapy")} disabled={loading}>
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Get Therapy"}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </>
  );
}

