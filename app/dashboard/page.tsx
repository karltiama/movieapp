"use client"; // Ensure this is a client component

import Header from "@/components/Header"; // Import the new Header component
import { useAuth } from "@/lib/authContext";

function Dashboard() {
	const user = useAuth();

	return (
		<div className="flex flex-col min-h-screen bg-muted/40">
			<Header />
			{user && <p>Your email: {user.email}</p>}
			{/* Add more dashboard content here */}
		</div>
	);
}

export default Dashboard;
