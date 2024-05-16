// Import necessary components and hooks from React and MUI
"use client";
import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import {
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import StopIcon from "@mui/icons-material/Stop";

export default function Page({ params }: { params: { journal_id: string } }) {
  // State to hold the journal text
  const [journalText, setJournalText] = useState("");
  const [topSentiment, setTopSentiment] = useState("");
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [databaseSolutions, setDatabaseSolutions] = useState([]);
  const [likedSolutions, setLikedSolutions] = useState({});

  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [loadingProblems, setLoadingProblems] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const recognition = useRef(null);

  // Function to handle text area change
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJournalText(event.target.value);
  };

  const fetchEditJournal = async (journal_id, journalText) => {
    const res = await fetch("/api/editJournal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        journal_id,
        journal_text: journalText,
      }),
    });
    return res;
  };

  const fetchSentimentAnalysis = async (journal_id, journalText) => {
    const res = await fetch("/api/sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ journal_id, journal_text: journalText }),
    });
    return res;
  };

  const fetchProblems = async (journal_id, journalText) => {
    const res = await fetch("/api/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        journal_id,
        journal_text: journalText,
      }),
    });
    return res;
  };

  const fetchSolutionForProblem = async (problem) => {
    console.log("FETCHING SOL FOR", problem.problem);
    const res = await fetch("/api/getSolution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem: problem.problem,
      }),
    });

    const solution = await res.json(); // Assuming the response contains JSON data

    // Include problem_id and problem in the solution object
    return {
      ...solution,
      problem_id: problem.problem_id,
      problem: problem.problem,
    };
  };

  const fetchSolutionsForAllProblems = async (problems) => {
    for (const problem of problems) {
      try {
        const solution = await fetchSolutionForProblem(problem);
        setSolutions((prevSolutions) => [...prevSolutions, solution]);
      } catch (error) {
        console.error("Error fetching solution:", error);
      }
    }
  };

  const fetchSolutionForDatabase = async (problem) => {
    const res = await fetch("/api/getSolutionFromDB", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem: problem.problem,
      }),
    });

    const solution = await res.json(); // Assuming the response contains JSON data

    // Include problem_id and problem in the solution object
    return {
      ...solution,
      problem_id: problem.problem_id,
      problem: problem.problem,
    };
  };

  const fetchSolutionsFromDatabase = async (problems) => {
    for (const problem of problems) {
      try {
        const solution = await fetchSolutionForDatabase(problem);
        console.log("SOLTUIN", solution);
        if (Object.keys(solution.solution).length != 0) {
          setDatabaseSolutions((prevSolutions) => [...prevSolutions, solution]);
        }
      } catch (error) {
        console.error("Error fetching solution:", error);
      }
    }
  };

  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;

    recognition.current.onstart = () => {
      setIsListening(true);
    };

    recognition.current.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setJournalText(
            (prevText) => prevText + event.results[i][0].transcript
          );
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    recognition.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  useEffect(() => {
    console.log("SOLUTIONS", solutions);
  }, [solutions]);

  // Function to handle the submit action
  const handleSubmit = async () => {
    console.log("Journal Text:", journalText);

    //modify journal entry
    const resEditJournal = await fetchEditJournal(
      params.journal_id,
      journalText
    );

    //extract sentiments and save it in db
    setLoadingSentiment(true);
    const resSentiment = await fetchSentimentAnalysis(
      params.journal_id,
      journalText
    );
    const data = await resSentiment.json();
    setTopSentiment(data.topSentiment);
    setLoadingSentiment(false);

    //extract problems and save it in db
    setLoadingProblems(true);
    const resProblems = await fetchProblems(params.journal_id, journalText);
    const problemsData = await resProblems.json();
    setProblems(problemsData.problems);
    setLoadingProblems(false);

    fetchSolutionsFromDatabase(problemsData.problems);

    fetchSolutionsForAllProblems(problemsData.problems);
  };

  const handleLike = async (solution) => {
    const { exercise_name, description } = solution.solution;
    const { problem_id } = solution;

    const res = await fetch("/api/saveSolution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exercise_name,
        description,
        problem_id,
      }),
    });

    if (res.ok) {
      console.log("Solution liked successfully");
      setLikedSolutions((prevLiked) => ({
        ...prevLiked,
        [solution.problem_id]: true,
      }));
    } else {
      console.error("Failed to like the solution");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <TextField
        label="Journal Entry"
        multiline
        rows={10}
        variant="outlined"
        fullWidth
        value={journalText}
        onChange={handleTextChange}
        sx={{ mt: 2, mb: 2 }}
      />

      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
        <Grid item>
          <IconButton onClick={startSpeechRecognition} disabled={isListening}>
            {isListening ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              <RecordVoiceOverIcon />
            )}
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={stopSpeechRecognition}>
            <StopIcon />
          </IconButton>
        </Grid>
      </Grid>

      <br />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {loadingSentiment == true ? (
            <CircularProgress /> // Show loading spinner while sentiment is being fetched
          ) : (
            <Card sx={{ mt: 2, width: 300 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Sentiment
                </Typography>
                <Typography>{topSentiment}</Typography>
              </CardContent>
            </Card>
          )}
          <br />
          {loadingProblems == true ? (
            <CircularProgress />
          ) : (
            <Card sx={{ mt: 2, width: 300 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Identified Problems
                </Typography>
                <Typography>
                  {problems?.map((problem, index) => (
                    <React.Fragment key={index}>
                      {problem.problem}
                      {index !== problems.length - 1 && ", "}
                    </React.Fragment>
                  ))}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={4}>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {databaseSolutions?.map((solution, index) => (
              <Card key={index} sx={{ mb: 2, width: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Recommended Excercise {index + 1}
                  </Typography>
                  <Typography>
                    <b>Problem: </b> {solution.problem}
                  </Typography>
                  <Typography>
                    <b>Exercise Name: </b> {solution.solution.exercise_name}
                  </Typography>
                  <Typography>
                    <b>Description: </b> {solution.solution.description}
                  </Typography>
                  {/* {likedSolutions[solution.problem_id] ? (
                    <Typography color="primary">You have liked this recommendation</Typography>
                  ) : (
                    <IconButton
                      color="primary"
                      onClick={() => handleLike(solution)}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                  )} */}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {solutions?.map((solution, index) => (
              <Card key={index} sx={{ mb: 2, width: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    LLM Generated Execercise {index + 1}
                  </Typography>
                  <Typography>
                    <b>Problem: </b> {solution.problem}
                  </Typography>
                  <Typography>
                    <b>Exercise Name: </b> {solution.solution.exercise_name}
                  </Typography>
                  <Typography>
                    <b>Description: </b> {solution.solution.description}
                  </Typography>
                  {likedSolutions[solution.problem_id] ? (
                    <Typography color="primary">
                      You have liked this recommendation
                    </Typography>
                  ) : (
                    <IconButton
                      color="primary"
                      onClick={() => handleLike(solution)}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
