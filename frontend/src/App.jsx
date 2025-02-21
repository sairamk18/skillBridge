import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import EduBot from "./components/EduBot.jsx";
import JobMate from "./components/JobMate.jsx";
import Wellness from "./components/Wellness.jsx";
import ChatBot from "./components/ChatBot.jsx";
import CodeDebugger from "./components/CodeDebugger.jsx";
import FocusMode from "./components/FocusMode.jsx"; // ✅ Import FocusMode
import TranscriptBot from "./components/TranscriptBot.jsx"; // ✅ Import TranscriptBot
import MentalHealthBot from "./components/MentalHealthBot.jsx"; // ✅ Import new bot

import { Container, Typography, CssBaseline, ThemeProvider, createTheme, Switch, Box, Button } from "@mui/material";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Main Page */}
          <Route
            path="/"
            element={
              <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
                <Box display="flex" justifyContent="flex-end">
                  <Switch
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    color="default"
                  />
                  <Typography sx={{ ml: 1 }}>
                    {darkMode ? "🌙 Dark Mode" : "☀ Light Mode"}
                  </Typography>
                </Box>

                <Typography variant="h4" color="primary" gutterBottom>
                  🚀 SkillBridge - Career & Learning Assistant
                </Typography>

                <EduBot darkMode={darkMode} />
                <JobMate darkMode={darkMode} />
                <Wellness darkMode={darkMode} />
                <ChatBot darkMode={darkMode} />
                <CodeDebugger darkMode={darkMode} />
                <TranscriptBot darkMode={darkMode} /> {/* ✅ Added TranscriptBot */}
		<MentalHealthBot darkMode={darkMode} /> {/* ✅ Add Mental Health Bot */}

                {/* ✅ Focus Mode Button */}
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/focus"
                  sx={{ mt: 3 }}
                >
                  🧘‍♂️ Start Focus Mode
                </Button>
              </Container>
            }
          />

          {/* Focus Mode Page */}
          <Route path="/focus" element={<FocusMode darkMode={darkMode} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

