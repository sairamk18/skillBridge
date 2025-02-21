import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { motion } from "framer-motion";

const TRANSCRIPT_API_URL = "http://127.0.0.1:5000/upload_transcript";
const QUERY_API_URL = "http://127.0.0.1:5000/ask_transcript";

export default function TranscriptBot({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadTranscript = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    try {
      await axios.post(TRANSCRIPT_API_URL, { user_id: "default_user", transcript });
      setUploadSuccess(true);
      setTranscript("");
      alert("Transcript uploaded successfully!");
    } catch (error) {
      alert("Error uploading transcript.");
    }
    setLoading(false);
  };

  const askTranscript = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(QUERY_API_URL, { user_id: "default_user", question: query });
      setResponse(res.data.answer);
    } catch (error) {
      setResponse("Error: Unable to retrieve answer.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Transcript Bot Button */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 160,
            right: 20,
            bgcolor: darkMode ? "#444" : "#388E3C",
            color: "white",
            width: 60,
            height: 60,
            borderRadius: "50%",
            boxShadow: 3,
            "&:hover": { bgcolor: darkMode ? "#333" : "#2E7D32" },
          }}
        >
          <DescriptionIcon sx={{ fontSize: 30 }} />
        </IconButton>
      )}

      {/* Transcript Bot Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: 120,
            right: 20,
            width: 350,
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
              <Typography variant="h6">📜 Transcript Bot</Typography>
              <IconButton onClick={() => setIsOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Transcript Upload */}
            <TextField
              fullWidth
              label="Paste your transcript here..."
              variant="outlined"
              multiline
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={uploadTranscript}
              disabled={loading}
              fullWidth
            >
              {loading ? "Uploading..." : "Upload Transcript"}
            </Button>

            {uploadSuccess && (
              <TextField
                fullWidth
                label="Ask a question about the transcript..."
                variant="outlined"
                multiline
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
            )}

            {uploadSuccess && (
              <Button
                variant="contained"
                color="secondary"
                onClick={askTranscript}
                disabled={loading}
                fullWidth
              >
                {loading ? "Processing..." : "Ask Question"}
              </Button>
            )}

            {/* Response Output */}
            {response && (
              <Box mt={2} p={2} sx={{ bgcolor: darkMode ? "#333" : "#F5F5F5", borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  💡 Answer:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                  {response}
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      )}
    </>
  );
}

