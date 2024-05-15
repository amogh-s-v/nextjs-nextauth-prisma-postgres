// /app/page.tsx
import CreateJournal from "@/components/CreateJournal";
import { authOptions } from "@/lib/auth";
import { Button, Card, CardContent, Typography } from "@mui/material"; // Importing Material-UI components
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("SESSION", session)
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
          <CreateJournal userid={session?.user.id}/>
        </CardContent>
      </Card>
    </div>
  );
}
