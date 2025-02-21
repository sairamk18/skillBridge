import { useState } from "react";
import { getWellnessCheck } from "../api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Wellness() {
  const [userInput, setUserInput] = useState("");
  const [moodAnalysis, setMoodAnalysis] = useState("");

  const analyzeMood = async () => {
    const result = await getWellnessCheck(userInput);
    setMoodAnalysis(result);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" color="error" gutterBottom>
          <FavoriteIcon /> Mental Wellness Check-In
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="How are you feeling today?"
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{ mb: 2 }}
        />
        {moodAnalysis && (
          <Box mt={2} p={2} bgcolor="#f3f3f3" borderRadius={2}>
            <Typography variant="body1">{moodAnalysis}</Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={analyzeMood}
        >
          Analyze Mood
        </Button>
      </CardActions>
    </Card>
  );
}

