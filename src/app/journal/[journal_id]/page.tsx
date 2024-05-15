// Import necessary components and hooks from React and MUI
"use client";
import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Page({ params }: { params: { journal_id: string } }) {
  // State to hold the journal text
  const [journalText, setJournalText] = useState("");
  const [topSentiment, setTopSentiment] = useState("");
  const [problems, setProblems] = useState([]);

  // Function to handle text area change
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJournalText(event.target.value);
  };

  // Function to handle the submit action
  const handleSubmit = async () => {
    console.log("Journal Text:", journalText);
    const res = await fetch("/api/editJournal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        journal_id: params.journal_id,
        journal_text: journalText,
      }),
    });

    const resSentiment = await fetch("/api/sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({journal_id: params.journal_id, journal_text: journalText}),
    })
    console.log("RESPONSE", resSentiment);
    const data = await resSentiment.json();
    setTopSentiment(data.topSentiment);

    const resProblems = await fetch("/api/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        journal_id: params.journal_id,
        journal_text: journalText,
      }),
    });
    const problemsData = await resProblems.json();
    console.log("problemsData", problemsData)
    setProblems(problemsData.problems);
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
      <div>My Journal: {params.journal_id}</div>
      {/* MUI TextField component for the journal text area */}
      <TextField
        label="Journal Entry"
        multiline
        rows={10}
        variant="outlined"
        fullWidth
        value={journalText}
        onChange={handleTextChange}
        sx={{ mt: 2, mb: 2 }} // Margin top and bottom for spacing
      />
      {/* MUI Button component for the submit action */}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <br></br>
      {topSentiment == "" ? (
        <></>
      ) : (
        <Typography>
          The Top sentiment Identified From the Journal Entry: {topSentiment}
        </Typography>
      )}
      <br></br>
      <Typography>Problems Identified: </Typography>
      {problems.length === 0 ? (
        <></> // Empty fragment if there are no problems
      ) : (
        <Typography>
          {problems.map((problem, index) => (
            <React.Fragment key={index}>
              {problem}
              {index !== problems.length - 1 && ", "}{" "}
              {/* Add comma if it's not the last element */}
            </React.Fragment>
          ))}
        </Typography>
      )}
    </Box>
  );
}
