"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient"; // Import your Supabase client

export default function LoginForm() {
	const router = useRouter(); // Initialize the router
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLogin, setIsLogin] = useState(true);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (isLogin) {
				// Handle login
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				// Redirect to the dashboard after successful login
				router.push("/dashboard");
			} else {
				// Check if passwords match
				if (password !== confirmPassword) {
					throw new Error("Passwords do not match.");
				}

				// Handle sign up
				const { error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;
				// Redirect to the dashboard after successful sign-up
				router.push("/dashboard");
			}
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="mx-auto max-w-sm space-y-6 p-4 sm:p-6">
			<CardHeader className="space-y-2 text-center">
				<CardTitle className="text-3xl font-bold">Login or Sign Up</CardTitle>
				<CardDescription>
					Enter your information to access your account or create a new one.
				</CardDescription>
			</CardHeader>
			<Card className="p-4 sm:p-6">
				<Tabs
					defaultValue="login"
					className="w-full"
					onValueChange={(value) => setIsLogin(value === "login")}>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="signup">Sign Up</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								{error && <p className="text-red-500">{error}</p>}
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</div>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Processing..." : "Login"}
								</Button>
							</CardContent>
						</form>
					</TabsContent>
					<TabsContent value="signup">
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								{error && <p className="text-red-500">{error}</p>}
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Processing..." : "Sign Up"}
								</Button>
							</CardContent>
						</form>
					</TabsContent>
				</Tabs>
			</Card>
		</Card>
	);
}
