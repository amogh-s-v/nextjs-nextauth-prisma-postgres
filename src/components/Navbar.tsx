import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "next/link";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./buttons/SignOutButton";

const pages = ["Problem History", "Sentiment History"];

async function ResponsiveAppBar() {
  const session = await getServerSession(authOptions);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AutoStoriesIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TherapeutAI
          </Typography>

          
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                key={page}
                href={
                  page === "Sentiment History"
                    ? "/sentiment-history"
                    : `/${page.toLowerCase().replace(/ /g, "-")}`
                }
              >
                <Button
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          {session?.user ? (
            <SignOutButton/>
          ): (
            <Button color="secondary">
            <Link href='/sign-in'>Sign In</Link>
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
