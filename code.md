"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";

export default function Login() {
return (
<>
<Header />
<section className="py-20 px-4">
<div className="container mx-auto max-w-md">
<AuthTabs />
</div>
</section>
</>
);
}

function AuthTabs() {
return (
<Card>
<CardHeader>
<CardTitle className="text-center">Welcome to JobTracker</CardTitle>
<CardDescription className="text-center">
Sign in to your account or create a new one
</CardDescription>
</CardHeader>
<CardContent>
<Tabs defaultValue="signin" className="w-full">
<TabsList className="grid w-full grid-cols-2">
<TabsTrigger value="signin">Sign In</TabsTrigger>
<TabsTrigger value="signup">Sign Up</TabsTrigger>
</TabsList>
<TabsContent value="signin">
<SignInForm />
</TabsContent>
<TabsContent value="signup">
<SignUpForm />
</TabsContent>
</Tabs>
</CardContent>
</Card>
);
}

function SignInForm() {
const router = useRouter();
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
setIsLoading(true);
setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      router.push("/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }

};

return (
<form className="space-y-4" onSubmit={handleSubmit}>
{error && (
<div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
<span className="block sm:inline">{error}</span>
</div>
)}
<div className="space-y-2">
<Label htmlFor="email">Email</Label>
<Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
</div>
<div className="space-y-2">
<Label htmlFor="password">Password</Label>
<Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
</div>
<Button type="submit" className="w-full" disabled={isLoading}>
{isLoading ? "Signing in..." : "Sign In"}
</Button>
<div className="text-center">
<Button variant="link" className="text-sm">
Forgot password?
</Button>
</div>
</form>
);
}

function SignUpForm() {
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const router = useRouter();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
setIsLoading(true);
setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }

};

return (
<form className="space-y-4" onSubmit={handleSubmit}>
{error && (
<div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
<span className="block sm:inline">{error}</span>
</div>
)}
<div className="space-y-2">
<Label htmlFor="name">Full Name</Label>
<Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          required
        />
</div>
<div className="space-y-2">
<Label htmlFor="email">Email</Label>
<Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
</div>
<div className="space-y-2">
<Label htmlFor="phoneNumber">Phone Number</Label>
<Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          required
        />
</div>
<div className="space-y-2">
<Label htmlFor="password">Password</Label>
<Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          minLength={8}
          required
        />
</div>
<Button type="submit" className="w-full" disabled={isLoading}>
{isLoading ? "Creating Account..." : "Sign Up"}
</Button>
<p className="text-sm text-center text-muted-foreground">
Already have an account?{" "}
<button
type="button"
onClick={() => document.querySelector('[value="signin"]')}
className="text-primary underline-offset-4 hover:underline" >
Sign in
</button>
</p>
</form>
);
}
