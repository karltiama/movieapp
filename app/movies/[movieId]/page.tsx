"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

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
			} catch (error) {
				console.error("Failed to fetch movie details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMovieDetails();
	}, [movieId]);

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
							<Button variant="ghost" size="icon">
								<HeartIcon className="w-5 h-5 fill-primary" />
								<span className="sr-only">Like</span>
							</Button>
							<Button variant="ghost" size="icon">
								<StarIcon className="w-5 h-5 fill-primary" />
								<span className="sr-only">Add to Favorites</span>
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

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
		</svg>
	);
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	);
}

export default MovieDetailPage;
