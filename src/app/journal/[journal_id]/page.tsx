// Import necessary components and hooks from React and MUI
"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { CircularProgress, Card, CardContent, Grid } from "@mui/material";

export default function Page({ params }: { params: { journal_id: string } }) {
  // State to hold the journal text
  const [journalText, setJournalText] = useState("");
  const [topSentiment, setTopSentiment] = useState("");
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);

  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [loadingProblems, setLoadingProblems] = useState(false);

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

    fetchSolutionsForAllProblems(problemsData.problems);
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
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
                    Solution {index + 1}
                  </Typography>
                  <Typography><b>Probkem: </b> {solution.problem}</Typography>
                  <Typography><b>Excercise Name: </b> {solution.solution.exercise_name}</Typography>
                  <Typography><b>Description: </b> {solution.solution.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
