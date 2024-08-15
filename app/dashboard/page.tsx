"use client"; // Ensure this is a client component

import withAuth from "../../lib/withAuth";
import { useAuth } from "@/lib/authContext"; // Optional, if using context for user session

function Dashboard() {
	const user = useAuth(); // Access user data from context if using AuthProvider

	return (
		<div>
			<h1>Welcome to your Dashboard</h1>
			{user && <p>Your email: {user.email}</p>}
			{/* Add more dashboard content here */}
		</div>
	);
}

export default withAuth(Dashboard);
