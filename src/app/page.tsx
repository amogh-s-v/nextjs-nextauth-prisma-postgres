import React from 'react';
import { Container, Typography, Button, Box, Paper, Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const App = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" color="primary">
          Welcome to your Journal Space
        </Typography>
        <Button variant="contained" color="primary" href="#create-journal" sx={{ alignSelf: 'flex-start' }}>
          Create Journal Entry
        </Button>
      </Box>
      
      <Grid container direction="column" spacing={2}>
        {/* WHY? Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'primary.main', color: '#FFFFFF' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              WHY?
            </Typography>
            <Typography variant="body1">
              This app helps individuals with disabilities improve their lifestyle through daily journaling. It provides personalized exercise suggestions and tracks your progress, empowering you to make positive changes for a healthier life.
            </Typography>
          </Paper>
        </Grid>
        
        {/* HOW? Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'primary.main', color: '#FFFFFF' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              HOW?
            </Typography>
            <Box>
              <Typography component="div">
                <ArrowForwardIosIcon sx={{ verticalAlign: 'middle', color: 'white' }} /> Create daily journal entries.
              </Typography>
              <Typography component="div">
                <ArrowForwardIosIcon sx={{ verticalAlign: 'middle', color: 'white' }} /> App analyzes entries for patterns.
              </Typography>
              <Typography component="div">
                <ArrowForwardIosIcon sx={{ verticalAlign: 'middle', color: 'white' }} /> Track your sentiment and problem history.
              </Typography>
              <Typography component="div">
                <ArrowForwardIosIcon sx={{ verticalAlign: 'middle', color: 'white' }} /> Customize your exercise routines.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;