"use client"; // Ensure this is a client component

import { useState } from "react";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface SearchMoviesProps {
	onResultSelect?: (movie: any) => void; // Optional callback for selecting a movie
}

const SearchMovies: React.FC<SearchMoviesProps> = ({ onResultSelect }) => {
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value; // No trimming to preserve spaces
		setQuery(query);

		if (!query) {
			setSearchResults([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const url = `https://api.themoviedb.org/3/search/movie?api_key=${
				process.env.NEXT_PUBLIC_TMDB_API_KEY
			}&query=${encodeURIComponent(query)}`;
			console.log("Fetch URL:", url); // Log the URL to debug spaces handling

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error("Failed to fetch movies");
			}

			const data = await response.json();
			setSearchResults(data.results);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const handleMovieClick = () => {
		// Reset the search state
		setQuery("");
		setSearchResults([]);
	};

	return (
		<div className="relative">
			<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search movies..."
				className="w-full pl-10 rounded-full"
				onChange={handleSearch}
				value={query}
			/>
			{loading && (
				<p className="absolute top-full left-0 w-full mt-2 text-center text-sm">
					Loading...
				</p>
			)}
			{error && <p className="text-red-500 mt-4">{error}</p>}
			{searchResults.length > 0 && (
				<div className="absolute top-full left-0 w-full mt-2 bg-background border rounded-lg shadow-lg z-10">
					<div className="p-4 grid gap-4">
						{searchResults.map((movie) => (
							<Link
								href={`/movies/${movie.id}`}
								key={movie.id}
								onClick={handleMovieClick} // Reset search state on click
							>
								<div className="flex items-center gap-4 cursor-pointer">
									<img
										src={
											movie.poster_path
												? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
												: "/placeholder.svg"
										}
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
											{movie.vote_average}
										</div>
										<p className="text-sm line-clamp-2">{movie.overview}</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchMovies;
