"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string;
	vote_average: number;
	director: string;
	cast: string[];
	genre: string[];
	runtime: number;
	release_date: string;
}

const MovieDetailPage = ({ params }: { params: { movieId: string } }) => {
	const { movieId } = params;
	const [movie, setMovie] = useState<Movie | null>(null);
	const [loading, setLoading] = useState(true);
	const [adding, setAdding] = useState(false); // State for adding to watchlist
	const [isInWatchlist, setIsInWatchlist] = useState(false); // State for checking if already in watchlist

	useEffect(() => {
		const fetchMovieDetails = async () => {
			try {
				const response = await fetch(
					`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits`
				);
				const data = await response.json();

				// Extract director and cast information from the credits response
				const director =
					data.credits.crew.find((member: any) => member.job === "Director")
						?.name || "N/A";
				const cast = data.credits.cast
					.slice(0, 3)
					.map((actor: any) => actor.name)
					.join(", ");
				const genre = data.genres.map((g: any) => g.name).join(", ");

				setMovie({
					id: data.id,
					title: data.title,
					overview: data.overview,
					poster_path: data.poster_path,
					vote_average: data.vote_average,
					director,
					cast,
					genre,
					runtime: data.runtime,
					release_date: data.release_date,
				});

				// Check if the movie is already in the watchlist
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session) {
					const userId = session.user.id;
					const { data: existingEntry } = await supabase
						.from("user_movie_list")
						.select("*")
						.eq("user_id", userId)
						.eq("movie_id", movieId)
						.single();

					if (existingEntry) {
						setIsInWatchlist(true);
					}
				}
			} catch (error) {
				console.error("Failed to fetch movie details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMovieDetails();
	}, [movieId]);

	const handleAddToWatchlist = async () => {
		if (!movie) return;
		setAdding(true);

		try {
			// Get the current user's session
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError || !session) {
				console.error("Not authenticated", sessionError);
				return;
			}

			const userId = session.user.id;

			// Insert the movie into the user's watchlist
			const { error } = await supabase.from("user_movie_list").insert({
				user_id: userId,
				movie_id: movie.id,
				movie_title: movie.title, // Store the movie title
				poster_path: movie.poster_path, // Store the poster path
				vote_average: movie.vote_average, // Store the vote average
				status: "want-to-watch", // You can customize this status
			});

			if (error) {
				console.error("Error adding movie to watchlist:", error.message);
			} else {
				alert(`${movie.title} has been added to your watchlist!`);
				setIsInWatchlist(true); // Mark as added to the watchlist
			}
		} catch (error) {
			console.error("Failed to add movie to watchlist:", error);
		} finally {
			setAdding(false);
		}
	};

	if (loading) {
		return <p>Loading movie details...</p>;
	}

	if (!movie) {
		return <p>Movie not found</p>;
	}

	return (
		<Card className="p-4 md:p-6 lg:p-8">
			<div className="grid md:grid-cols-2 gap-6">
				<div className="relative aspect-[2/3] overflow-hidden rounded-lg">
					<img
						src={
							movie.poster_path
								? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
								: "/placeholder.svg"
						}
						alt={movie.title}
						width="300"
						height="400"
						className="object-cover w-full h-full"
						style={{ aspectRatio: "300/400", objectFit: "cover" }}
					/>
					<div className="absolute top-4 right-4 bg-background/70 rounded-full p-2 flex items-center justify-center">
						<div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
							<span className="text-primary-foreground font-bold text-lg">
								{movie.vote_average}
							</span>
						</div>
					</div>
				</div>
				<Card className="p-4">
					<div className="grid gap-4">
						<h2 className="text-2xl font-bold">{movie.title}</h2>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={handleAddToWatchlist}
								disabled={adding || isInWatchlist}>
								<Star
									className={`w-5 h-5 ${isInWatchlist ? "fill-primary" : ""}`}
								/>
								<span className="sr-only">Add to Watchlist</span>
							</Button>
						</div>
						<div className="grid gap-2 text-sm">
							<div>
								<span className="font-medium">Director:</span> {movie.director}
							</div>
							<div>
								<span className="font-medium">Starring:</span> {movie.cast}
							</div>
							<div>
								<span className="font-medium">Genre:</span> {movie.genre}
							</div>
							<div>
								<span className="font-medium">Runtime:</span> {movie.runtime}{" "}
								minutes
							</div>
							<div>
								<span className="font-medium">Release Date:</span>{" "}
								{new Date(movie.release_date).toLocaleDateString()}
							</div>
						</div>
					</div>
				</Card>
			</div>
		</Card>
	);
};

export default MovieDetailPage;
