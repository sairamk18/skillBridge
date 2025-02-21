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
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");

  const fetchSentiment = async () => {
    const result = await getWellnessCheck(text);
    setSentiment(result);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" color="error" gutterBottom>
          <FavoriteIcon /> Mental Wellness Check
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Write How You Feel..."
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />
        {sentiment && (
          <Box mt={2} p={2} bgcolor="#f3f3f3" borderRadius={2}>
            <Typography variant="body1">{sentiment}</Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={fetchSentiment}
        >
          Analyze Mood
        </Button>
      </CardActions>
    </Card>
  );
}

