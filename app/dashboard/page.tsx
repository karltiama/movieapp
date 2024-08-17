"use client"; // Ensure this is a client component

import { useState } from "react";
import { LogOut, Search, Settings, Star, UserRound } from "lucide-react";
import withAuth from "../../lib/withAuth";
import { useAuth } from "@/lib/authContext"; // Optional, if using context for user session
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

function Dashboard() {
	const user = useAuth(); // Access user data from context if using AuthProvider
	const [searchResults, setSearchResults] = useState<
		{ title: string; rating: number; description: string }[]
	>([]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase();

		// If the query is empty, clear the search results
		if (query === "") {
			setSearchResults([]);
			return;
		}

		// Example movie data to search from
		const results = [
			{
				title: "Inception",
				rating: 8.8,
				description:
					"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea in the mind of a CEO.",
			},
			{
				title: "Interstellar",
				rating: 8.6,
				description:
					"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
			},
			{
				title: "Arrival",
				rating: 8.0,
				description:
					"A linguist is recruited by the military to assist in translating alien communications and help determine whether they come in peace or are a threat.",
			},
		].filter(
			(movie) =>
				movie.title.toLowerCase().includes(query) ||
				movie.description.toLowerCase().includes(query)
		);

		setSearchResults(results);
	};

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error.message);
		} else {
			window.location.href = "/"; // Redirect to the login page
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-muted/40">
			<header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-background sm:px-6">
				<div className="flex-1 relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search..."
						className="w-full pl-10 rounded-full"
						onChange={handleSearch}
					/>
					{searchResults.length > 0 && (
						<div className="absolute top-full left-0 w-full mt-2 bg-background border rounded-lg shadow-lg z-10">
							<div className="p-4 grid gap-4">
								{searchResults.map((movie, index) => (
									<div
										key={index}
										className="flex items-center gap-4 cursor-pointer">
										<img
											src="/placeholder.svg"
											alt={movie.title}
											width={80}
											height={120}
											className="rounded-lg"
											style={{ aspectRatio: "80/120", objectFit: "cover" }}
										/>
										<div>
											<div className="font-medium">{movie.title}</div>
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<Star className="w-4 h-4 fill-primary" />
												{movie.rating}
											</div>
											<p className="text-sm line-clamp-2">
												{movie.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon" className="ml-4">
							<UserRound className="w-5 h-5" />
							<span className="sr-only">User Menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>User Menu</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href="#"
								className="flex items-center gap-2"
								prefetch={false}>
								<UserRound className="w-4 h-4" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link
								href="#"
								className="flex items-center gap-2"
								prefetch={false}>
								<Settings className="w-4 h-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							<LogOut className="w-4 h-4" />
							<span>Sign Out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>
			{user && <p>Your email: {user.email}</p>}
			{/* Add more dashboard content here */}
		</div>
	);
}

export default withAuth(Dashboard);
