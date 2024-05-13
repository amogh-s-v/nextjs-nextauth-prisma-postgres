// /app/page.tsx

import { Button, Card, CardContent, Typography } from "@mui/material"; // Importing Material-UI components
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-lg mx-auto mt-8">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Create New Journal Entry
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Write about your experiences and track your progress.
          </Typography>
          <Button variant="contained" color="primary">
            <Link href="/admin">Create New Journal Entry</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
