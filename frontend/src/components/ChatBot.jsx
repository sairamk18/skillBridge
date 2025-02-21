import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar, IconButton, Select, MenuItem } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import axios from "axios";
import { motion } from "framer-motion";
import ScrollToBottom from "react-scroll-to-bottom";

const CHATBOT_API_URL = "http://127.0.0.1:5000/chatbot";

export default function ChatBot({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US"); // Default: English
  const [speaking, setSpeaking] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(CHATBOT_API_URL, { message });
      const botResponse = res.data.response;
      setChatHistory((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: "bot", text: "Error: Unable to connect." }]);
    }

    setLoading(false);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.start();
  };

  const speakText = (text, language) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <>
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            bgcolor: darkMode ? "#444" : "#1976D2",
            color: "white",
            width: 60,
            height: 60,
            borderRadius: "50%",
            boxShadow: 3,
            "&:hover": { bgcolor: darkMode ? "#333" : "#1565C0" },
          }}
        >
          <ChatIcon sx={{ fontSize: 30 }} />
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
            right: 20,
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
              <Typography variant="h6">💬 Smart ChatBot</Typography>
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
                  {msg.sender === "bot" && <Avatar src="https://i.imgur.com/7v5ASc8.png" sx={{ mr: 1, width: 30, height: 30 }} />}
                  <Box sx={{ p: 1, borderRadius: 2, maxWidth: "70%", bgcolor: msg.sender === "user" ? "#1976D2" : "#E0E0E0", color: msg.sender === "user" ? "white" : "black" }}>
                    {msg.text}
                    {msg.sender === "bot" && (
                      <>
                        <IconButton size="small" onClick={() => speakText(msg.text, language)} sx={{ ml: 1 }}>
                          <VolumeUpIcon />
                        </IconButton>
                        {speaking && (
                          <IconButton size="small" onClick={stopSpeaking} sx={{ ml: 1 }}>
                            <StopIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                  {msg.sender === "user" && <Avatar src="https://i.imgur.com/MT8Vx3d.png" sx={{ ml: 1, width: 30, height: 30 }} />}
                </motion.div>
              ))}
            </ScrollToBottom>

            <TextField fullWidth label="Ask a question..." variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} sx={{ mb: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Select value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ mr: 2 }}>
                <MenuItem value="en-US">English</MenuItem>
                <MenuItem value="es-ES">Spanish</MenuItem>
                <MenuItem value="fr-FR">French</MenuItem>
                <MenuItem value="hi-IN">Hindi</MenuItem>
                <MenuItem value="zh-CN">Chinese</MenuItem>
              </Select>

              <Button variant="contained" color="primary" onClick={sendMessage} disabled={loading}>
                {loading ? "Typing..." : "Send"}
              </Button>

              <IconButton onClick={startListening} color={listening ? "secondary" : "primary"}>
                <MicIcon />
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
      )}
    </>
  );
}

