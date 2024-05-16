import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import CreateJournal from "@/components/CreateJournal";

const App = async () => {
  const session = await getServerSession(authOptions);
  return (
    <Grid container direction="row" spacing={2}>
      <Grid
        item
        xs={8}
        container
        justifyContent="flex-start"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
          }}
        >
          <Typography variant="h3" component="h1" color="primary">
            Welcome to your Journal Space, {session?.user.username}
          </Typography>
        </Box>

        <Grid container direction="column" spacing={2}>
          {/* WHY? Section */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{ p: 3, bgcolor: "primary.main", color: "#FFFFFF" }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                WHY?
              </Typography>
              <Typography variant="body1">
                This app helps individuals with disabilities improve their
                lifestyle through daily journaling. It provides personalized
                exercise suggestions and tracks your progress, empowering you to
                make positive changes for a healthier life.
              </Typography>
            </Paper>
          </Grid>

          {/* HOW? Section */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{ p: 3, bgcolor: "primary.main", color: "#FFFFFF" }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                HOW?
              </Typography>
              <Box>
                <Typography component="div">
                  <ArrowForwardIosIcon
                    sx={{ verticalAlign: "middle", color: "white" }}
                  />{" "}
                  Create daily journal entries.
                </Typography>
                <Typography component="div">
                  <ArrowForwardIosIcon
                    sx={{ verticalAlign: "middle", color: "white" }}
                  />{" "}
                  App analyzes entries for patterns.
                </Typography>
                <Typography component="div">
                  <ArrowForwardIosIcon
                    sx={{ verticalAlign: "middle", color: "white" }}
                  />{" "}
                  Track your sentiment and problem history.
                </Typography>
                <Typography component="div">
                  <ArrowForwardIosIcon
                    sx={{ verticalAlign: "middle", color: "white" }}
                  />{" "}
                  Customize your exercise routines.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={4}
        container
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            position: "relative",
            width: "100%",
            margin: "auto",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <h2>Journal Entry</h2>
                
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Write about your experiences and track your progress.
              </Typography>
              <CreateJournal userid={session?.user.id} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default App;
