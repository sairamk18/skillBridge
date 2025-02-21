import { useState } from "react";
import { getEduBotSuggestions } from "../api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

export default function EduBot() {
  const [jobRole, setJobRole] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const fetchResources = async () => {
    const result = await getEduBotSuggestions(jobRole);
    setSuggestions(result);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom>
          <SchoolIcon /> EduBot - Learning Suggestions
        </Typography>
        <TextField
          fullWidth
          label="Enter Target Job Role"
          variant="outlined"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          sx={{ mb: 2 }}
        />
        {suggestions && (
          <Box mt={2} p={2} bgcolor="#f3f3f3" borderRadius={2}>
            <Typography variant="body1">{suggestions}</Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={fetchResources}
        >
          Get Suggestions
        </Button>
      </CardActions>
    </Card>
  );
}

