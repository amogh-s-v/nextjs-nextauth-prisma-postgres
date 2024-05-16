"use client";
import React, { useEffect, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  TableContainer,
  tableCellClasses,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Custom theme for the app
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
      color: "#444",
    },
  },
});

// Custom styles for table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // Hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Page = () => {
  const [sentimentHistory, setSentimentHistory] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
  };

  useEffect(() => {
    fetchSentiment();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleOpenModal = (journalText) => {
    setSelectedJournal(journalText);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedJournal(null);
    setModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Sentiment History
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Sentiment</StyledTableCell>
                <StyledTableCell>Journal Entry</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sentimentHistory.map((sentiment, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    {formatDate(sentiment.date)}
                  </StyledTableCell>
                  <StyledTableCell>{sentiment.sentiment}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenModal(sentiment.journal_text)}
                    >
                      Show Entry
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h2 style={{ color: "black" }}>Journal Entry</h2>

            <p style={{ color: "black" }}>{selectedJournal}</p>
          </div>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Page;
