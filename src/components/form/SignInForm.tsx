// components/SignInForm.tsx
"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Divider,
} from "@mui/material"; // Importing Material-UI components
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema using Zod
const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
});

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    values
  ) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log("SIGN IN DATA", signInData);

    if (signInData?.error) {
    } else {
      router.push("/admin");
    }
  };

  return (
    <form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      <Box maxWidth={400} mx="auto" mt={4} p={2}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          {...form.register("email")}
          error={!!form.formState.errors.email}
          helperText={form.formState.errors.email?.message}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          {...form.register("password")}
          error={!!form.formState.errors.password}
          helperText={form.formState.errors.password?.message}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mb: 2 }}
        >
          Sign in
        </Button>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          If you dont have an account, please{" "}
          <Link href="/sign-up" underline="hover" color="primary">
            Sign up
          </Link>
        </Typography>
      </Box>
    </form>
  );
};

export default SignInForm;
