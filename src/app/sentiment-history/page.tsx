"use client"

import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const Page = () => {

  const [sentimentHistory, setSentimentHistory] = useState([]);

  const fetchSentiment = async () => {
    const res = await fetch("/api/sentimentHistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // If you need to send any additional data in the request, you can include it here
      }),
    });

    const data = await res.json();

    setSentimentHistory(data.sentimentHistory);
    console.log("SENTIMENTS", data.sentimentHistory);
  };

  useEffect(()=>{
    fetchSentiment();
  }, []);

  return (
    <div>
      <h1>Sentiment History</h1>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Sentiment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sentimentHistory && sentimentHistory?.map((sentiment, index) => (
              <TableRow key={index}>
                <TableCell>{sentiment.date}</TableCell>
                <TableCell>{sentiment.sentiment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default Page;
