"use client"; // Ensure this is a client component

import { LogOut, Settings, UserRound } from "lucide-react";
import { useAuth } from "@/lib/authContext";
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
import { supabase } from "@/lib/supabaseClient";
import SearchMovies from "@/components/SearchMovies"; // Import the SearchMovies component

const Header = () => {
	const user = useAuth();

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error.message);
		} else {
			window.location.href = "/"; // Redirect to the login page
		}
	};

	return (
		<header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-background sm:px-6">
			<div className="flex-1 relative">
				<SearchMovies /> {/* Include the search component */}
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
							href="/dashboard" // Update this line to redirect to the dashboard
							className="flex items-center gap-2"
							prefetch={false}>
							<UserRound className="w-4 h-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href="#" className="flex items-center gap-2" prefetch={false}>
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
	);
};

export default Header;
