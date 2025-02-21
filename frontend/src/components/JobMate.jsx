import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";

const JOBMATE_API_URL = "http://127.0.0.1:5000/jobmate"; // Backend API URL

export default function JobMate() {
  const [resume, setResume] = useState("");
  const [bullets, setBullets] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResumeAnalysis = async () => {
    if (!resume.trim()) return;

    setLoading(true);
    setBullets("");

    try {
      const res = await axios.post(JOBMATE_API_URL, { resume });
      setBullets(res.data.resume_bullets || "⚠️ No analysis returned. Try again.");
    } catch (error) {
      setBullets("Error: Unable to fetch resume analysis.");
    }

    setLoading(false);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" color="secondary" gutterBottom>
          <WorkIcon /> JobMate - Resume Helper
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Paste Your Resume"
          variant="outlined"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          sx={{ mb: 2 }}
        />
        {bullets && (
          <Box mt={2} p={2} bgcolor="#f3f3f3" borderRadius={2}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {bullets}
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={fetchResumeAnalysis}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </CardActions>
    </Card>
  );
}

