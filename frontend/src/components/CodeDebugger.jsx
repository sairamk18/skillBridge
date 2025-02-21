import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton, Select, MenuItem, CircularProgress, FormControlLabel, Switch } from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import { motion } from "framer-motion";

const DEBUGGER_API_URL = "http://127.0.0.1:5000/debug_code"; // Backend API for debugging
const CODE_QUESTION_API_URL = "http://127.0.0.1:5000/ask_code_question"; // API to ask questions

export default function CodeDebugger({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [debuggedCode, setDebuggedCode] = useState("");
  const [bugExplanationText, setBugExplanationText] = useState("");
  const [performanceAnalysisText, setPerformanceAnalysisText] = useState("");
  const [securityAnalysisText, setSecurityAnalysisText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("python"); // Default: Python
  const [error, setError] = useState("");
  const [bugExplanation, setBugExplanation] = useState(false);
  const [performanceAnalysis, setPerformanceAnalysis] = useState(false);
  const [securityAnalysis, setSecurityAnalysis] = useState(false);

  // Function to debug code
  const debugCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setDebuggedCode(""); // Clear previous output
    setBugExplanationText("");
    setPerformanceAnalysisText("");
    setSecurityAnalysisText("");
    setError("");

    try {
      const res = await axios.post(DEBUGGER_API_URL, { 
        code, 
        language,
        bug_explanation: bugExplanation,
        performance_analysis: performanceAnalysis,
        security_analysis: securityAnalysis
      });

      setDebuggedCode(res.data.debugged_code || "");
      setBugExplanationText(res.data.bug_explanation || "");
      setPerformanceAnalysisText(res.data.performance_analysis || "");
      setSecurityAnalysisText(res.data.security_analysis || "");

    } catch (error) {
      setError("Error: Unable to connect to the debugger.");
    }

    setLoading(false);
  };

  // Function to ask questions about the code
  const askCodeQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(""); // Clear previous answer

    try {
      const res = await axios.post(CODE_QUESTION_API_URL, { code, question, language });
      setAnswer(res.data.answer || "No response received.");
    } catch (error) {
      setAnswer("Error: Unable to process the question.");
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(debuggedCode);
    alert("Code copied to clipboard!");
  };

  return (
    <>
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            bgcolor: darkMode ? "#444" : "#D32F2F",
            color: "white",
            width: 60,
            height: 60,
            borderRadius: "50%",
            boxShadow: 3,
            "&:hover": { bgcolor: darkMode ? "#333" : "#B71C1C" },
          }}
        >
          <BugReportIcon sx={{ fontSize: 30 }} />
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
            bottom: 100,
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
              <Typography variant="h6">🐞 Code Debugger</Typography>
              <IconButton onClick={() => setIsOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Select value={language} onChange={(e) => setLanguage(e.target.value)} fullWidth sx={{ mb: 2 }}>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="javascript">JavaScript</MenuItem>
            </Select>

            <FormControlLabel control={<Switch checked={bugExplanation} onChange={() => setBugExplanation(!bugExplanation)} />} label="Explain Bugs" />
            <FormControlLabel control={<Switch checked={performanceAnalysis} onChange={() => setPerformanceAnalysis(!performanceAnalysis)} />} label="Performance Analysis" />
            <FormControlLabel control={<Switch checked={securityAnalysis} onChange={() => setSecurityAnalysis(!securityAnalysis)} />} label="Security Analysis" />

            <TextField fullWidth label="Paste your code here..." variant="outlined" multiline rows={6} value={code} onChange={(e) => setCode(e.target.value)} sx={{ mb: 2 }} />

            <Button variant="contained" color="primary" onClick={debugCode} disabled={loading} fullWidth>
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Debug Code"}
            </Button>

            {debuggedCode && (
              <Box mt={2} p={2} sx={{ bgcolor: darkMode ? "#333" : "#F5F5F5", borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">✅ Debugged Code:</Typography>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{debuggedCode}</Typography>
              </Box>
            )}

            {performanceAnalysisText && <Typography mt={2}><strong>Performance Analysis:</strong> {performanceAnalysisText}</Typography>}
            {securityAnalysisText && <Typography mt={2}><strong>Security Analysis:</strong> {securityAnalysisText}</Typography>}
            {bugExplanationText && <Typography mt={2}><strong>Bug Explanation:</strong> {bugExplanationText}</Typography>}

            {/* Ask Question About Code */}
            <TextField fullWidth label="Ask a question about the code..." variant="outlined" value={question} onChange={(e) => setQuestion(e.target.value)} sx={{ mt: 2 }} />
            <Button variant="contained" color="secondary" onClick={askCodeQuestion} disabled={loading} fullWidth sx={{ mt: 1 }}>
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Ask Question"}
            </Button>

            {answer && (
              <Box mt={2} p={2} sx={{ bgcolor: darkMode ? "#222" : "#eee", borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">🤖 Answer:</Typography>
                <Typography variant="body2">{answer}</Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      )}
    </>
  );
}

